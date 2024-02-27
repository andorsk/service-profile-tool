import { resolveDID, validateServiceProfiles } from "./did";

describe("test did resolution", () => {
  const sampleGoodDID =
    "did:ethr:mainnet:0x3b0bc51ab9de1e5b7b6e34e5b960285805c41736";
  const sampleBadDID = "did:example:123456";

  it("test resolve did", async () => {
    const res = await resolveDID(sampleGoodDID);
    expect(res).toBeDefined();
    expect(resolveDID(sampleBadDID)).rejects.toThrow();
  });

  it("test check service profile", () => {
    const validCheck = {
      "@context": [
        "https://www.w3.org/ns/did/v1",
        "https://trustoverip.org/profile/v2",
      ],
      service: [
        {
          id: "did:example:123#trust-registry",
          type: "TrustRegistry",
          serviceEndpoint: {
            profile: "https://trustoverip.org/profiles/trp/v2",
            uri: "https://my-tr-service/",
            integrity:
              "122041dd7b6443542e75701aa98a0c235951a28a0d851b11564d20022ab11d2589a8",
          },
        },
      ],
    };

    const invalidVector = {
      "@context": [
        "https://www.w3.org/ns/did/v1",
        "https://trustoverip.org/profile/v2",
      ],
      service: [
        {
          id: "did:example:123#trust-registry",
          type: "TrustRegistry",
          serviceEndpoint: {
            uri: "https://my-tr-service/",
            integrity:
              "122041dd7b6443542e75701aa98a0c235951a28a0d851b11564d20022ab11d2589a8",
          },
        },
      ],
    };

    const results = validateServiceProfiles(validCheck);
    expect(results.length).toBe(1);
    expect(results[0].isValid).toBe(true);

    const badResults = validateServiceProfiles(invalidVector);
    expect(badResults.length).toBe(1);
    expect(badResults[0].isValid).toBe(false);
  });
});
