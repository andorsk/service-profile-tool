import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import fs from "fs/promises"; // Using fs.promises for async file operations
import { SchemaValidator } from "../validator.js";
import { resolveDID } from "../did.js";
import readline from "readline";

interface Arguments {
  validate?: boolean;
  url?: string;
  resolve?: string;
}

const parseArgs = async () => {
  const argv: Arguments | Promise<Arguments> = yargs(hideBin(process.argv))
    .option("validate", {
      describe: "validate the profile",
      type: "boolean",
    })
    .option("url", {
      describe: "url of the profile",
      type: "string",
    })
    .option("resolve", {
      describe: "resove the did",
      type: "string",
    })
    .parse();
  return await argv; // Await if argv is a promise
};

const readFile = async (path: string): Promise<string> => {
  try {
    return await fs.readFile(path, "utf-8");
  } catch (error) {
    throw new Error(`Error reading file: ${error}`);
  }
};

const validateProfile = async (args: Arguments) => {
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

const handleResolveDID = async (args: Arguments) => {
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

const fetchServiceProfile = async (url: string) => {
  fetch(url, {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Error resolving service:", error);
    });
};

const main = async () => {
  const args = await parseArgs();
  if (args.validate) {
    await validateProfile(args);
  } else if (args.resolve) {
    handleResolveDID(args);
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
