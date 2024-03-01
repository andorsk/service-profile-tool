import { ServiceProfileMetadata } from "../lib/models.js";
import * as ed from "@noble/ed25519";

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

  constructor(privKey: Uint8Array) {
    this.privKey = privKey;
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
