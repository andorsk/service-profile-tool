import { ServiceProfile, ServiceProfileMetadata } from "./index";

import { SchemaValidator } from "./validator";

const vector1 = {
  results: {
    valid: true,
  },
  data: {
    metadata: {
      id: "did:example:123456",
      profileType: "TrustRegistry",
      created: "2023-08-18T12:34:56Z",
      description:
        "An RestfulAPI that describes how an ecosystem based on trust can query and interact with a service to perform a query agasint a trusted regsitry.",
      short_description:
        "The open standard trust task protocol defined by the ToIP Foundation to perform the trust task of querying a trust registry.",
      docs_url: "https://trustoverip.org/trustregistryprotocol",
      version: "2.0.0",
      tags: ["toip", "trustregistryprotocol"],
    },
    proof: {
      type: "Ed25519Signature",
      created: "2023-08-18T12:34:56Z",
      proofValue: "abcdefg123456",
      verificationMethod: "did:example:123456#key1",
    },
  },
};

const vector2 = {
  results: {
    valid: false,
  },
  data: {
    metadata: {
      version: "2.0.0",
    },
  },
};

const testVectors = [vector1, vector2];
describe("test schema validator", () => {
  it("test basic vectors", () => {
    testVectors.forEach((vector) => {
      expect(SchemaValidator.validate(vector.data)).toBe(vector.results.valid);
    });
  });
});

describe("test profile generatar", () => {
  const profile1 = new ServiceProfile(vector1.data.metadata);
});
