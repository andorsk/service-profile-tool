import { resolveDID } from "../../did.js";
import readline from "readline";
import { SchemaValidator } from "../../validator.js";
import { ServiceProfile, ServiceProfileMetadata } from "../../models.js";
import { Arguments } from "./models.js";
import { readFile, fetchServiceProfile } from "./util.js";

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
  rl.close();
  const sp = new ServiceProfile(meta as ServiceProfileMetadata);
  console.log("Service Profile created");
  console.log(JSON.stringify(sp, null, 2));
  return sp;
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
  rl.question(
    "Enter the index of the service you want to resolve: ",
    async (index: string) => {
      try {
        const n = parseInt(index);
        if (n >= doc.service.length) {
          console.error("Invalid index");
          process.exit(1);
        }
        console.log("Resolving the service...");
        fetchServiceProfile(doc.service[n].serviceEndpoint.profile);
        console.log("choose the service to resolve", index);
        rl.close();
      } catch (error) {
        console.error("Error resolving service:", error);
        process.exit(1);
      }
    },
  );
};
