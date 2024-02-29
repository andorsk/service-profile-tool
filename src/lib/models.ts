export type ServiceProfileMetadata = {
  id: string; // must be a UUID
  constroller: string; // controls the service profile
  type?: string;
  created?: string;
  description?: string;
  short_description?: string;
  docs_url?: string;
  supported_protocols?: string[];
  tags?: string[];
  version?: string;
};

export type Proof = {
  type: string;
  created: string;
  proofValue: string;
  verificationMethod: string;
};

export class ServiceProfile {
  metadata: ServiceProfileMetadata;
  proof?: Proof;
  constructor(metadata: ServiceProfileMetadata, proof?: Proof) {
    this.metadata = metadata;
    this.proof = proof;
  }
}
