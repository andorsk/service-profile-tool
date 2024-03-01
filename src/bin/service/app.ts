import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { ProfileService } from "./service.js";
import { CachedReference } from "./storage.js";
import { ServiceProfile } from "../../lib/models.js";
import { multiHash } from "../../lib/crypto.js";
import { resolveDID } from "../../lib/did.js";
import { fetchServiceProfile } from "./util.js";

const app = express();
const port = 3000;

app.use(express.json());

const apiRouter = express.Router();
app.use("/api", apiRouter);

const profileService = new ProfileService();

// POST /profiles - Create a new profile
apiRouter.post("/profiles", (req: Request, res: Response) => {
  const profile: ServiceProfile = req.body;
  profileService.saveProfile(profile);
  res.status(201).send({ message: "Profile created successfully" });
});

apiRouter.get("/health", (req: Request, res: Response) => {
  console.log("Health check");
  res.status(200).json({ message: "Profile service is healthy" });
});

apiRouter.get("/profiles", (req: Request, res: Response) => {
  res.status(200).json(profileService.getAllProfiles());
});

type RequestReference = {
  url: string;
};

apiRouter.get(
  "/reference",
  async (
    req: Request,
    res: Response,
  ): Promise<Response<any, Record<string, any>>> => {
    const url = req.query.url as string; // Type casting for simplicity, consider validating
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
  },
);

apiRouter.get(
  "/resolve",
  async (
    req: Request,
    res: Response,
  ): Promise<Response<any, Record<string, any>>> => {
    const did = req.query.did as string; // Type casting for simplicity, consider validating
    let index = req.query.index as string; // Type casting for simplicity, consider validating
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
    const profile = await fetchServiceProfile(
      doc.service[n].serviceEndpoint.profile,
    );
    return res.status(200).json(profile);
  },
);

// GET /profiles/:id - Get a profile by ID
apiRouter.get("/profiles/:id", (req: Request, res: Response) => {
  const id: string = req.params.id;
  const profile = profileService.getProfile(id);
  if (profile) {
    res.status(200).json(profile);
  } else {
    res.status(404).send({ message: "Profile not found" });
  }
});

// POST /cached-references - Set a cached reference
apiRouter.post("/cached-references", (req: Request, res: Response) => {
  const reference: CachedReference = req.body;
  profileService.setCachedPointer(reference);
  res.status(201).send({ message: "Cached reference set successfully" });
});

// GET /cached-references/:id - Get a cached reference by ID
apiRouter.get("/cached-references/:id", (req: Request, res: Response) => {
  const id: string = req.params.id;
  const integrity: string | undefined = req.query.integrity as string;
  const reference = profileService.getCachedPointer(id, integrity);
  if (reference) {
    res.status(200).json(reference);
  } else {
    res.status(404).send({ message: "Cached reference not found" });
  }
});

app.listen(port, () => {
  console.log(`Profile service API listening at http://localhost:${port}`);
});
