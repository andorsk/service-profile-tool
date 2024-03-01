import { ServiceProfile } from "../lib/models.js";
import {
  createPublicPrivateKey,
  generateIntegrityValueFromText,
} from "./crypto.js";

describe("test crypto libs", () => {
  let privateKey: Uint8Array;
  let publicKey: Uint8Array;
  beforeEach(async () => {
    ({ privateKey, publicKey } = await createPublicPrivateKey());
    expect(privateKey).toBeDefined();
    expect(publicKey).toBeDefined();
  });

  it("generate did", () => {
    expect(privateKey).toBeDefined();
    expect(publicKey).toBeDefined();
  });
});

describe("test integrity creator", () => {
  it("test multihash v2", async () => {
    const hash = await generateIntegrityValueFromText("Merkle–Damgård");
    expect(hash).toBeDefined();
    expect(hash).toBe(
      "122041dd7b6443542e75701aa98a0c235951a28a0d851b11564d20022ab11d2589a8",
    );
  });
});
