import { ProfileStorage, CachedReference } from "./storage";
import { ServiceProfile } from "../../lib/models";

export class ProfileService {
  storage: ProfileStorage;

  constructor() {
    this.storage = new ProfileStorage();
  }

  saveProfile(profile: ServiceProfile) {
    this.storage.saveProfile(profile);
  }

  getProfile(id: string): ServiceProfile {
    return this.storage.getProfile(id);
  }

  // Cached Reference Service
  setCachedPointer(reference: CachedReference) {
    this.storage.setCachedPointer(reference);
  }

  getCachedPointer(id: string, integrity?: string): CachedReference {
    return this.storage.getCachedPointer(id, integrity);
  }
}
