import { resolveDID } from "../../lib/did.js";
import readline from "readline";
import { SchemaValidator } from "../../lib/validator.js";
import { ServiceProfile, ServiceProfileMetadata } from "../../lib/models.js";
import { Arguments } from "./models.js";
import { readFile, fetchServiceProfile } from "./util.js";
import { v4 as uuidv4 } from "uuid";

import { multiHash, createPublicPrivateKey } from "../../lib/crypto.js";
import { ProfileSigner, verifyServiceProfileProof } from "../../lib/proof.js";

const askQuestion = (
  rl: any,
  question: string,
  defaultValue = "",
): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(`${question}: `, (answer: string) => {
      resolve(answer || defaultValue);
    });
  });
};

export const handleVerification = async (args: Arguments) => {};

export const handleCreateProfile = async (): Promise<ServiceProfile> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let meta: Partial<ServiceProfileMetadata> = {};

  const questions: {
    question: string;
    key: keyof Omit<ServiceProfileMetadata, "id">;
    defaultValue?: string;
  }[] = [
    { question: "What is the type", key: "type" },
    {
      question: "What is the description",
      key: "description",
      defaultValue: "none",
    },
    {
      question: "What is the short description",
      key: "short_description",
      defaultValue: "none",
    },
    { question: "What is the docs URL", key: "docs_url" },
    {
      question: "What are the supported protocols (comma-separated)",
      key: "supported_protocols",
    },
    { question: "What tags are associated (comma-separated)", key: "tags" },
    { question: "What is the version", key: "version" },
  ];

  for (const { question, key, defaultValue } of questions) {
    const answer: string = await askQuestion(rl, question, defaultValue || "");
    if (key === "supported_protocols" || key === "tags") {
      meta[key] = answer.split(",").map((item) => item.trim());
    } else {
      meta[key] = answer;
    }
  }

  meta.created = new Date().toISOString();
  meta.id = uuidv4();
  rl.close();
  let sp = new ServiceProfile(meta as ServiceProfileMetadata);
  // generate keys
  const { privateKey } = await createPublicPrivateKey();
  const signer = new ProfileSigner(privateKey);
  sp = signer.signProfile(sp);
  console.log("Service Profile created");
  console.log(JSON.stringify(sp, null, 2));
  return sp;
};

export const handleVerifyProfile = async (args: Arguments) => {
  if (!args.url) {
    console.error("URL is required for verification");
    process.exit(1);
  }
  const profile = await fetchServiceProfile(args.url!);
  if (!profile.proof) {
    console.error("Profile has no proof");
    process.exit(1);
  }
  const { publicKey } = await createPublicPrivateKey();
  const isValid = verifyServiceProfileProof(
    profile.proof,
    profile.metadata,
    publicKey,
  );
  if (isValid) {
    console.log("Profile is verified");
    process.exit(0);
  } else {
    console.error("Profile is not verified");
    process.exit(1);
  }
};

export const handleValidateProfile = async (args: Arguments) => {
  if (args.url) {
    try {
      const fileContent = await readFile(args.url);
      console.log(`Validating the profile from file: ${args.url}`);
      const valid = SchemaValidator.validate(JSON.parse(fileContent));
      if (valid) {
        console.log("Profile is valid");
        process.exit(0);
      } else {
        console.error("Profile is not valid");
        process.exit(1);
      }
    } catch (error: any) {
      console.error(error);
      process.exit(1);
    }
  } else {
    console.error("URL is required for validation");
    process.exit(1);
  }
};

export const handleResolveDID = async (args: Arguments) => {
  const doc = await resolveDID(args.resolve!);
  if (!doc) {
    console.error("Error resolving DID");
    process.exit(1);
  }
  if (!doc.service || doc.service.length === 0) {
    console.info("No services available for the Doc.");
    console.log(doc);
    process.exit(1);
  }
  console.log(`${doc.service.length} services available.`);
  let count = 0;
  doc.service.forEach((service: any) => {
    console.info(
      `Index: ${count} Service ID: ${service.id} Service Type: ${service.type} Service Profile: ${service.serviceEndpoint.profile}`,
    );
    count++;
  });
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const index = await askQuestion(
    rl,
    "Enter the index of the service you want to resolve",
    "0",
  );
  try {
    const n = parseInt(index);
    if (n >= doc.service.length) {
      console.error("Invalid index");
      process.exit(1);
    }
    const profile = await fetchServiceProfile(
      doc.service[n].serviceEndpoint.profile,
    );
    rl.close();
    console.log(JSON.stringify(profile, null, 2));
  } catch (error) {
    console.error("Error resolving service:", error);
    process.exit(1);
  }
};

export const handleReferenceProfile = async (args: Arguments) => {
  if (!args.reference) {
    console.error("URL is required for referencing");
    process.exit(1);
  }
  const response = await fetch(args.reference, { method: "GET" });
  if (!response.ok) throw new Error("Network response was not ok.");
  const text = await response.text();
  const buffer = Buffer.from(text);
  const integrity = await multiHash(buffer);
  const reference = {
    integrity: integrity,
    profile: args.reference,
    uri: "<insert service uri here>",
  };
  console.log(JSON.stringify(reference, null, 2));
};
