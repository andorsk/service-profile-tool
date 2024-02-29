import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { ProfileService } from "./service";
import { CachedReference } from "./storage";
import { ServiceProfile } from "../../lib/models";

const app = express();
const port = 3000;

app.use(bodyParser.json());

const profileService = new ProfileService();

// POST /profiles - Create a new profile
app.post("/profiles", (req: Request, res: Response) => {
  const profile: ServiceProfile = req.body;
  profileService.saveProfile(profile);
  res.status(201).send({ message: "Profile created successfully" });
});

// GET /profiles/:id - Get a profile by ID
app.get("/profiles/:id", (req: Request, res: Response) => {
  const id: string = req.params.id;
  const profile = profileService.getProfile(id);
  if (profile) {
    res.status(200).json(profile);
  } else {
    res.status(404).send({ message: "Profile not found" });
  }
});

// POST /cached-references - Set a cached reference
app.post("/cached-references", (req: Request, res: Response) => {
  const reference: CachedReference = req.body;
  profileService.setCachedPointer(reference);
  res.status(201).send({ message: "Cached reference set successfully" });
});

// GET /cached-references/:id - Get a cached reference by ID
app.get("/cached-references/:id", (req: Request, res: Response) => {
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
