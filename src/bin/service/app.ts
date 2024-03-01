import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { ProfileService } from "./service.js";
import { CachedReference } from "./storage.js";
import { ServiceProfile } from "../../lib/models.js";

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
  console.log("Get all profiles");
  res.status(200).json(profileService.getAllProfiles());
});

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
