import { ServiceProfile } from "../../lib/models";

export type CachedReference = {
  integrity: string; // hash of the profile
  id: string;
  profile: ServiceProfile;
};

export class ProfileStorage {
  storage: Storage;

  constructor() {
    this.storage = window.localStorage;
  }

  // Profile Storage
  saveProfile(profile: ServiceProfile) {
    this.storage.setItem(profile.metadata.id, JSON.stringify(profile));
  }

  getProfile(id: string): ServiceProfile {
    const profile = this.storage.getItem(id);
    if (!profile) {
      throw new Error("Profile not found");
    }
    return JSON.parse(profile) as ServiceProfile;
  }

  // Cached Reference Storage
  setCachedPointer(reference: CachedReference) {
    this.storage.setItem(reference.id, JSON.stringify(reference));
  }

  getCachedPointer(id: string, integrity?: string): CachedReference {
    const reference = this.storage.getItem(id);
    if (!reference) {
      throw new Error("Reference not found");
    }
    const ref = JSON.parse(reference) as CachedReference;
    if (ref.integrity !== integrity) {
      throw new Error("Integrity check failed");
    }
    return ref;
  }
}
