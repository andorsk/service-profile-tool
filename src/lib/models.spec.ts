import { SchemaValidator } from "./validator";
import { ServiceProfile, ServiceProfileMetadata, Proof } from "./models";

describe("check schemas", () => {
  it("should validate a good profile", () => {
    const goodProfile = {
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
      } as ServiceProfileMetadata,
      proof: {
        type: "Ed25519Signature",
        created: "2023-08-18T12:34:56Z",
        proofValue: "abcdefg123456",
        verificationMethod: "did:example:123456#key1",
      } as Proof,
    } as ServiceProfile;
    const valid = SchemaValidator.validate(goodProfile);
    expect(valid).toBe(true);
  });
});
