import * as ed from '@noble/ed25519';
import profileSchema from './profile.jsonschema';
import Ajv, {JSONSchemaType} from "ajv"


(async () => {
  // keys, messages & other inputs can be Uint8Arrays or hex strings
  // Uint8Array.from([0xde, 0xad, 0xbe, 0xef]) === 'deadbeef'
  const privKey = ed.utils.randomPrivateKey(); // Secure random private key
  const message = Uint8Array.from([0xab, 0xbc, 0xcd, 0xde]);
  const pubKey = await ed.getPublicKeyAsync(privKey); // Sync methods below
  const signature = await ed.signAsync(message, privKey);
  const isValid = await ed.verifyAsync(signature, message, pubKey);
})();

/*
 * metadata for service profile
 */
class ServiceProfileMetadata {
  _id: string;
  _type: string;
  _created: string;
  _description: string;
  _short_description: string;
  _docs_url: string;
  _supported_protocols: string[];
  _tags: string[];
  _version: string;
}

class ProfileLinter {

}

class ServiceProfile {

  this.metadata: ServiceProfileMetadata

  constructor() {
  }

  async getProfile() {
    return "ServiceProfile";
  }

  async sign(signer: Signer) {
  }

}

type Signer = {
  sign(message: Hex, privateKey: Hex): Uint8Array;
  signAsync(message: Hex, privateKey: Hex): Promise<Uint8Array>;
}

type Verifier = {
  verify(
    signature: Hex, // returned by the `sign` function
    message: Hex, // message that needs to be verified
    publicKey: Hex // public (not private) key,
    options = { zip215: true } // ZIP215 or RFC8032 verification type
  ): boolean;
  verifyAsync(signature: Hex, message: Hex, publicKey: Hex): Promise<boolean>;
}

class ProfileSigner = {

  privKey: Hex;

  constructor(privKey?: Hex, method: "ed25519") {
    if privKey ? this.priveKey = privKey : ed.utils.randomPrivateKey();
    this.privKey = privKey
  }

  sign(message: Hex, privateKey: Hex): Uint8Array {
    return ed.sign(message, privateKey)
  }

  signAsync(message: Hex, privateKey: Hex): Promise<Uint8Array>{
     return ed.signAsync(message, privateKey)
  }

}


class SchemaValidator {
  static ajv = new Ajv();
  constructor() {
    this.validator = SchemaValidator.ajv.compile(profileSchema);
  }

  validate(data) {
    return this.validator(data);
  }
}
