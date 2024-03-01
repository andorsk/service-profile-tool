import { ServiceProfile } from "../../lib/models.js";
import fs from "fs";

type DBStorage = {
  getItem: (id: string, namespace: string) => string | null;
  setItem: (id: string, namespace: string, data: string) => void;
  getKeysFromNamespace: (namespace: string) => string[];
};

type InitOptions = {
  DBPath: string;
};

/**
 * Super simple JSON storage
 */
export class JSONStorage implements DBStorage {
  data: { [key: string]: string } = {};
  options: InitOptions;

  constructor(options: InitOptions) {
    this.options = options;
    this.load(options.DBPath);
  }

  // read file
  load(path: string) {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        console.log(
          "Error reading file from disk. File doesn't exist. Making a new one.",
        );
        return;
      }
      try {
        this.data = JSON.parse(data);
      } catch (e) {
        console.error("Error parsing JSON data from disk:", e);
      }
    });
  }

  save() {
    fs.writeFile(this.options.DBPath, JSON.stringify(this.data), (err) => {
      if (err) {
        console.log("Error writing file to disk:", err);
      }
    });
  }

  joinNamespace(namespace: string, id: string) {
    return `${namespace}:${id}`;
  }

  getKeysFromNamespace(namespace: string) {
    const keys = Object.keys(this.data).filter(
      (key) => key.split(":")[0] === namespace,
    );
    return keys.map((key) => key.split(":")[1]);
  }

  getItem(id: string, namespace: string) {
    return this.data[this.joinNamespace(namespace, id)];
  }

  setItem(id: string, namespace: string, data: string) {
    this.data[this.joinNamespace(namespace, id)] = data;
    this.save();
  }
}

export type CachedReference = {
  integrity: string; // hash of the profile
  id: string;
  profile: ServiceProfile;
};

export class ProfileStorage {
  storage: DBStorage;
  profileNamespace = "profiles";
  referenceNamespace = "references";

  constructor(storage: DBStorage) {
    this.storage = storage;
  }

  // Profile Storage
  saveProfile(profile: ServiceProfile) {
    this.storage.setItem(
      profile.metadata.id,
      this.profileNamespace,
      JSON.stringify(profile),
    );
  }

  getProfile(id: string): ServiceProfile {
    const profile = this.storage.getItem(id, this.profileNamespace);
    if (!profile) {
      throw new Error("Profile not found");
    }
    return JSON.parse(profile) as ServiceProfile;
  }

  getProfiles() {
    return this.storage
      .getKeysFromNamespace(this.profileNamespace)
      .map((id: string) => {
        return this.getProfile(id);
      });
  }

  // Cached Reference Storage
  setCachedPointer(reference: CachedReference) {
    this.storage.setItem(
      reference.id,
      this.referenceNamespace,
      JSON.stringify(reference),
    );
  }

  getCachedPointer(id: string, integrity?: string): CachedReference {
    const reference = this.storage.getItem(id, this.referenceNamespace);
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
