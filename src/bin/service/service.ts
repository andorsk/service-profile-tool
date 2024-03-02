import { ProfileStorage, CachedReference } from "./storage.js";
import { ServiceProfile } from "../../lib/models.js";
import { JSONStorage } from "./storage.js";
import { SchemaValidator } from "../../lib/validator.js";

type GetAllProfilesResponse = Partial<ServiceProfile> & { id: string };

export class ProfileService {
  storage: ProfileStorage;

  constructor() {
    this.storage = new ProfileStorage(new JSONStorage({ DBPath: "db.json" }));
  }

  saveProfile(profile: ServiceProfile) {
    this.storage.saveProfile(profile);
  }

  getProfile(id: string): ServiceProfile {
    return this.storage.getProfile(id);
  }

  getAllProfiles(): GetAllProfilesResponse[] {
    return this.storage.getProfiles().map((profile: ServiceProfile) => {
      return {
        id: profile.metadata.id,
        name: profile.metadata.type,
        description: profile.metadata.description,
      };
    });
  }

  validateProfile(profile: ServiceProfile): boolean {
    return SchemaValidator.validate(profile); // Replace this with your actual validation logic
  }

  // Cached Reference Service
  setCachedPointer(reference: CachedReference) {
    this.storage.setCachedPointer(reference);
  }

  getCachedPointer(id: string, integrity?: string): CachedReference {
    return this.storage.getCachedPointer(id, integrity);
  }
}
