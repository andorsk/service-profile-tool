import fs from "fs";
/**
 * Super simple JSON storage
 */
export class JSONStorage {
    data = {};
    options;
    constructor(options) {
        this.options = options;
        this.load(options.DBPath);
    }
    // read file
    load(path) {
        fs.readFile(path, "utf8", (err, data) => {
            if (err) {
                console.log("Error reading file from disk. File doesn't exist. Making a new one.");
                return;
            }
            try {
                this.data = JSON.parse(data);
            }
            catch (e) {
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
    joinNamespace(namespace, id) {
        return `${namespace}:${id}`;
    }
    getKeysFromNamespace(namespace) {
        const keys = Object.keys(this.data).filter((key) => key.split(":")[0] === namespace);
        return keys.map((key) => key.split(":")[1]);
    }
    getItem(id, namespace) {
        return this.data[this.joinNamespace(namespace, id)];
    }
    setItem(id, namespace, data) {
        this.data[this.joinNamespace(namespace, id)] = data;
        this.save();
    }
}
export class ProfileStorage {
    storage;
    profileNamespace = "profiles";
    referenceNamespace = "references";
    constructor(storage) {
        this.storage = storage;
    }
    // Profile Storage
    saveProfile(profile) {
        this.storage.setItem(profile.metadata.id, this.profileNamespace, JSON.stringify(profile));
    }
    getProfile(id) {
        const profile = this.storage.getItem(id, this.profileNamespace);
        if (!profile) {
            throw new Error("Profile not found");
        }
        return JSON.parse(profile);
    }
    getProfiles() {
        return this.storage
            .getKeysFromNamespace(this.profileNamespace)
            .map((id) => {
            return this.getProfile(id);
        });
    }
    // Cached Reference Storage
    setCachedPointer(reference) {
        this.storage.setItem(reference.id, this.referenceNamespace, JSON.stringify(reference));
    }
    getCachedPointer(id, integrity) {
        const reference = this.storage.getItem(id, this.referenceNamespace);
        if (!reference) {
            throw new Error("Reference not found");
        }
        const ref = JSON.parse(reference);
        if (ref.integrity !== integrity) {
            throw new Error("Integrity check failed");
        }
        return ref;
    }
}
//# sourceMappingURL=storage.js.map