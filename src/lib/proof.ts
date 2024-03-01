import * as ed from "@noble/ed25519";
import { sha512 } from "@noble/hashes/sha512";
import { ServiceProfileMetadata } from "../lib/models.js";
import { createHash } from "node:crypto";

import * as multihashing from "multihashes";

// pollyfills
ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));

export type Signer = {
  sign(message: Uint8Array, privateKey: Uint8Array): Uint8Array;
  signAsync(message: Uint8Array, privateKey: Uint8Array): Promise<Uint8Array>;
};

export type Verifier = {
  verify(
    signature: Uint8Array,
    message: Uint8Array,
    publicKey: Uint8Array,
    options?: { zip215: boolean },
  ): boolean;
  verifyAsync(
    signature: Uint8Array,
    message: Uint8Array,
    publicKey: Uint8Array,
  ): Promise<boolean>;
};

type Proof = {
  type: string;
  created: string;
  proofValue: string;
  verificationMethod: string;
};

export class ProfileSigner {
  private privKey: Uint8Array;

  constructor(privKey?: Uint8Array) {
    this.privKey = privKey || ed.utils.randomPrivateKey();
  }

  generateProof(metadata: ServiceProfileMetadata): Proof {
    const rawMessage = JSON.stringify(metadata);
    const message = Buffer.from(rawMessage, "utf-8");
    const signature = ed.sign(message, this.privKey);
    return {
      type: "Ed25519Signature2018",
      created: new Date().toISOString(),
      proofValue: new TextDecoder().decode(signature),
      verificationMethod: `did:example:123#key1`,
    };
  }
}

export const createPublicPrivateKey = async (): Promise<{
  privateKey: Uint8Array;
  publicKey: Uint8Array;
}> => {
  const privateKey = ed.utils.randomPrivateKey(); // Assuming this is how your library generates a random private key
  const publicKey = await ed.getPublicKeyAsync(privateKey); // Assuming this is how your library gets the public key from the private key
  return { privateKey, publicKey };
};

export const generateIntegrityValueFromBytes = async (data: Uint8Array) => {
  const hash = createHash("sha256").update(data).digest("hex");
  const multihash = {
    digest: hash,
    name: "sha256",
    code: 0x12,
    length: hash.length,
  };
  console.log(multihash);
  const encoded = multihashing.encode(data, "sha2-256");
  console.log(encoded);
  console.log(
    "decoded",
    Buffer.from(multihashing.decode(encoded).digest).toString("hex"),
  );
  return hash;
};

export const generateIntegrityValueFromText = async (
  text: string,
): Promise<string> => {
  const encoded = new TextEncoder().encode(text);
  return generateIntegrityValueFromBytes(encoded);
};
