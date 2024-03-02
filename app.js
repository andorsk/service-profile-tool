import express from "express";
import { ProfileService } from "./service.js";
import { multiHash } from "../../lib/crypto.js";
import { resolveDID } from "../../lib/did.js";
import { fetchServiceProfile } from "./util.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
const app = express();
const port = 3000;
app.use(express.json());
const apiRouter = express.Router();
app.use("/api", apiRouter);
const profileService = new ProfileService();
// POST /profiles - Create a new profile
apiRouter.post("/profiles", (req, res) => {
    const profile = req.body;
    console.log("Profile received", profile);
    profileService.saveProfile(profile);
    res.status(201).send({ message: "Profile created successfully" });
});
// POST /profiles - Create a new profile
apiRouter.post("/validate/profile", (req, res) => {
    const profile = req.body;
    const isValid = profileService.validateProfile(profile);
    res.status(200).send({ isValid });
});
apiRouter.get("/health", (req, res) => {
    console.log("Health check");
    res.status(200).json({ message: "Profile service is healthy" });
});
apiRouter.get("/profiles", (req, res) => {
    res.status(200).json(profileService.getAllProfiles());
});
apiRouter.get("/reference", async (req, res) => {
    const url = req.query.url; // Type casting for simplicity, consider validating
    if (!url) {
        return res
            .status(400)
            .send({ message: "URL is required for referencing" });
    }
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) {
        return res.status(500).send({ message: "Network response was not ok." });
    }
    const text = await response.text();
    const buffer = Buffer.from(text);
    const integrity = await multiHash(buffer);
    const ret = {
        integrity: integrity,
        profile: url,
        uri: "<insert service uri here>",
    };
    return res.status(200).json(ret);
});
apiRouter.get("/resolve", async (req, res) => {
    const did = req.query.did; // Type casting for simplicity, consider validating
    let index = req.query.index; // Type casting for simplicity, consider validating
    if (index === undefined) {
        index = "0";
    }
    if (!did) {
        return res
            .status(400)
            .send({ message: "DID is required for referencing" });
    }
    const doc = await resolveDID(did);
    if (!doc || !doc.service || doc.service.length === 0) {
        return res.status(500).send({ message: "No services available for doc" });
    }
    const n = parseInt(index);
    const profile = await fetchServiceProfile(doc.service[n].serviceEndpoint.profile);
    return res.status(200).json(profile);
});
// GET /profiles/:id - Get a profile by ID
apiRouter.get("/profiles/:id", (req, res) => {
    const id = req.params.id;
    const profile = profileService.getProfile(id);
    if (profile) {
        res.status(200).json(profile);
    }
    else {
        res.status(404).send({ message: "Profile not found" });
    }
});
// POST /cached-references - Set a cached reference
apiRouter.post("/cached-references", (req, res) => {
    const reference = req.body;
    profileService.setCachedPointer(reference);
    res.status(201).send({ message: "Cached reference set successfully" });
});
// GET /cached-references/:id - Get a cached reference by ID
apiRouter.get("/cached-references/:id", (req, res) => {
    const id = req.params.id;
    const integrity = req.query.integrity;
    const reference = profileService.getCachedPointer(id, integrity);
    if (reference) {
        res.status(200).json(reference);
    }
    else {
        res.status(404).send({ message: "Cached reference not found" });
    }
});
// ui
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Adjust the path according to where your 'index.html' is located
const publicDirectoryPath = __dirname; //join(__dirname, "public");
// Serve static files from 'public' directory
app.use(express.static(publicDirectoryPath));
app.get("/", (req, res) => {
    res.sendFile("views/index.html", { root: publicDirectoryPath });
});
app.get("/bundle.js", (req, res) => {
    res.sendFile("views/bundle.js", { root: publicDirectoryPath });
});
app.get("/index.js", (req, res) => {
    res.sendFile("views/index.js", { root: publicDirectoryPath });
});
app.listen(port, () => {
    console.log(`Profile service API listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map