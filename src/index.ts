import * as ed from "@noble/ed25519";

import { sha512 } from "@noble/hashes/sha512";
ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));

// Example async function to demonstrate ed25519 usage
async function demoEd25519() {
  const privKey = ed.utils.randomPrivateKey(); // Secure random private key
  const message = Uint8Array.from([0xab, 0xbc, 0xcd, 0xde]);
  const pubKey = await ed.getPublicKey(privKey);
  const signature = await ed.sign(message, privKey);
  const isValid = await ed.verify(signature, message, pubKey);
  console.log(`Signature valid: ${isValid}`);
}

demoEd25519();

type ServiceProfileMetadata = {
  id: string;
  type?: string;
  created?: string;
  description?: string;
  short_description?: string;
  docs_url?: string;
  supported_protocols?: string[];
  tags?: string[];
  version?: string;
};

class ProfileLinter {}

class ServiceProfile {
  metadata: ServiceProfileMetadata;
  constructor(metadata: ServiceProfileMetadata) {
    this.metadata = metadata;
  }
  async getProfile() {
    return "ServiceProfile";
  }
  async sign(signer: Signer) {}
}

// Define types for Signer and Verifier
type Signer = {
  sign(message: Uint8Array, privateKey: Uint8Array): Uint8Array;
  signAsync(message: Uint8Array, privateKey: Uint8Array): Promise<Uint8Array>;
};

type Verifier = {
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

class ProfileSigner {
  private privKey: Uint8Array;

  constructor(privKey?: Uint8Array) {
    this.privKey = privKey || ed.utils.randomPrivateKey();
  }

  sign(message: Uint8Array): Uint8Array {
    return ed.sign(message, this.privKey);
  }

  async signAsync(message: Uint8Array): Promise<Uint8Array> {
    return ed.signAsync(message, this.privKey);
  }
}

export { ServiceProfile, ProfileSigner };

export type { ServiceProfileMetadata };
