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

export class ServiceProfile {
  metadata: ServiceProfileMetadata;
  constructor(metadata: ServiceProfileMetadata) {
    this.metadata = metadata;
  }
  async getProfile() {
    return "ServiceProfile";
  }
}
