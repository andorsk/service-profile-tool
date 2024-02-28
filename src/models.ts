export type ServiceProfileMetadata = {
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

export type Proof = {};

export class ServiceProfile {
  metadata: ServiceProfileMetadata;
  proof?: Proof;
  constructor(metadata: ServiceProfileMetadata, proof?: Proof) {
    this.metadata = metadata;
    this.proof = proof;
  }
}
