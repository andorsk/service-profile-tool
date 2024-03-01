import { ProfileSigner, verifyServiceProfileProof } from "./proof.js";
import { ServiceProfile } from "../lib/models.js";
import { createPublicPrivateKey } from "./crypto.js";

describe("generate proof", () => {
  let privateKey: Uint8Array;
  let publicKey: Uint8Array;
  beforeEach(async () => {
    ({ privateKey, publicKey } = await createPublicPrivateKey());
    expect(privateKey).toBeDefined();
    expect(publicKey).toBeDefined();
  });

  it("generate proof", () => {
    const metadata = {
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
    };

    const signer = new ProfileSigner(privateKey);
    const proof = signer.generateProof(metadata);
    expect(proof).toBeDefined();
    const sp = {
      metadata: metadata,
      proof: proof,
    } as ServiceProfile;
    // verify
    expect(verifyServiceProfileProof(proof, sp.metadata, publicKey)).toBe(true);
    const badProof = proof;
    badProof.proofValue =
      "JvYm5nAQx5Y9dD0JURkTb4JvposPKBUsJ+wFVqmV668J7w+Kebm30mH2eaRfcZgZR8G+bhQtaC7eJ8p9f7YCAA==";
    expect(verifyServiceProfileProof(badProof, sp.metadata, publicKey)).toBe(
      false,
    );
  });
});
