// import { createHash } from "node:crypto";
import { sha512 } from "@noble/hashes/sha512";

import { sha256 } from "@noble/hashes/sha256";

import * as ed from "@noble/ed25519";
ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));

function encodeVarint(value: number): Uint8Array {
  if (value < 0 || value > 127) {
    throw new Error("This implementation supports values between 0 and 127.");
  }
  return new Uint8Array([value]);
}

// 256 multihash
// TODO: might recommend moving to CID instead of multihash
export const multiHash = async (data: Uint8Array) => {
  const hash = sha256(data);
  //  const hash = createHash("sha256").update(data).digest();
  const hashCode = encodeVarint(0x12);
  const hashLength = encodeVarint(hash.length);
  const multihash = new Uint8Array([...hashCode, ...hashLength, ...hash]);
  return Array.from(multihash)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

export const generateIntegrityValueFromBytes = async (data: Uint8Array) => {
  return multiHash(data);
};

export const generateIntegrityValueFromText = async (
  text: string,
): Promise<string> => {
  const encoded = new TextEncoder().encode(text);
  return generateIntegrityValueFromBytes(encoded);
};

export const createPublicPrivateKey = async (): Promise<{
  privateKey: Uint8Array;
  publicKey: Uint8Array;
}> => {
  const privateKey = ed.utils.randomPrivateKey(); // Assuming this is how your library generates a random private key
  const publicKey = await ed.getPublicKeyAsync(privateKey); // Assuming this is how your library gets the public key from the private key
  return { privateKey, publicKey };
};
