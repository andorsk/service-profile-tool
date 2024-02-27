import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import fs from "fs/promises"; // Using fs.promises for async file operations
import { SchemaValidator } from "./validator";
import { resolveDID } from "./did";

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
  const did = await resolveDID(args.resolve!);
  console.log(`${did.services.length} services available.`);
  did.services.forEach((service: any) => {
    console.log(`Service ID: ${service.id}`);
    console.log(`Service Type: ${service.type}`);
    console.log(`Service Endpoint: ${service.serviceEndpoint.uri}`);
    console.log(`Service Profile: ${service.serviceEndpoint.profile}`);
  });
  // ask for input
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
