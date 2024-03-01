import { ServiceProfileMetadata, ServiceProfile } from "../lib/models.js";
import * as ed from "@noble/ed25519";

import { sha512 } from "@noble/hashes/sha512";
ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));

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
      proofValue: Buffer.from(signature).toString("base64"),
      verificationMethod: `did:example:123#key1`,
    };
  }

  signProfile(profile: ServiceProfile): ServiceProfile {
    const metadata = profile.metadata;
    const proof = this.generateProof(metadata);
    return {
      metadata: metadata,
      proof: proof,
    } as ServiceProfile;
  }
}

export const verifyServiceProfileProof = (
  proof: Proof,
  metadata: ServiceProfileMetadata,
  publicKey: Uint8Array,
): boolean => {
  const rawMessage = JSON.stringify(metadata);
  const sigH = Uint8Array.from(Buffer.from(proof.proofValue, "base64"));
  const msgk = Uint8Array.from(Buffer.from(rawMessage, "utf8"));
  const isValid = ed.verify(sigH, msgk, publicKey);
  return isValid;
};
