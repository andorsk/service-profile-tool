import { ProfileStorage } from "./storage.js";
import { JSONStorage } from "./storage.js";
import { SchemaValidator } from "../../lib/validator.js";
export class ProfileService {
    storage;
    constructor() {
        this.storage = new ProfileStorage(new JSONStorage({ DBPath: "db.json" }));
    }
    saveProfile(profile) {
        this.storage.saveProfile(profile);
    }
    getProfile(id) {
        return this.storage.getProfile(id);
    }
    getAllProfiles() {
        return this.storage.getProfiles().map((profile) => {
            return {
                id: profile.metadata.id,
                name: profile.metadata.type,
                description: profile.metadata.description,
            };
        });
    }
    validateProfile(profile) {
        return SchemaValidator.validate(profile); // Replace this with your actual validation logic
    }
    // Cached Reference Service
    setCachedPointer(reference) {
        this.storage.setCachedPointer(reference);
    }
    getCachedPointer(id, integrity) {
        return this.storage.getCachedPointer(id, integrity);
    }
}
//# sourceMappingURL=service.js.map