import Ajv, { JSONSchemaType } from "ajv";
import profileSchema from "./profile.json";

export class SchemaValidator {
  private static ajv = new Ajv();
  private static validator = SchemaValidator.ajv.compile(profileSchema);

  constructor() {}

  static validate(data: any): boolean {
    return SchemaValidator.validator(data);
  }
}
