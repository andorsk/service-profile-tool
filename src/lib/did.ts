import Ajv from "ajv";
import { serviceEndpointSchema } from "../schemas/serviceEndpoint.js";

type DIDDocument = {
  service: Service[];
};

type DIDResults = {
  didDocument: DIDDocument;
};

export const resolveDID = async (
  did: string,
  RESOLVER_API_URL = "https://dev.uniresolver.io/1.0/identifiers/",
): Promise<DIDDocument> => {
  try {
    const url = `${RESOLVER_API_URL}${did}`;
    const response = await fetch(url, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status}. ${response.statusText}}`,
      );
    }
    const data = await response.json();
    return (data as DIDResults).didDocument; // Assuming you want to return the response data
  } catch (error) {
    throw new Error(`Error resolving DID: ${error}`);
  }
};

type ServiceEndpoint = {
  uri: string;
  profile: string;
  format: string;
};

type Service = {
  id: string;
  type: string;
  serviceEndpoint: ServiceEndpoint;
};

export type ServiceValidationResult = {
  id: string;
  isValid: boolean;
  errors: any;
};

export const validateServiceProfiles = (
  didDocument: any,
): ServiceValidationResult[] => {
  const ajv = new Ajv();
  const validate = ajv.compile(serviceEndpointSchema);
  const results: ServiceValidationResult[] = [];

  if (didDocument.service && Array.isArray(didDocument.service)) {
    didDocument.service.forEach((service: Service) => {
      if (service.serviceEndpoint) {
        const isValid = validate(service.serviceEndpoint);
        results.push({
          id: service.id,
          isValid: isValid,
          errors: validate.errors ? validate.errors : null,
        });
      }
    });
  }
  return results;
};
