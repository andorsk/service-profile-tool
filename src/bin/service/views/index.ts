// import { SchemaValidator } from "/bundle.js";
// TODO : import directly from the bundle.js file

import { SchemaValidator } from "../../../lib/validator.js";
import { resolveDID } from "../../../lib/did.js";
import { fetchServiceProfile } from "../util.js";

class ProfileAPI {
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getProfile(id: string) {
    const response = await fetch(`${this.baseUrl}/profiles/${id}`);
    if (!response.ok) {
      throw new Error("Failed to get profile");
    }
    return response.json();
  }

  async validateProfile(profile: any): Promise<any> {
    const resp = await fetch(`${this.baseUrl}/validate/profile`, {
      method: "POST",
      body: JSON.stringify(profile),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return resp.json();
  }

  async resolveDID(did: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/resolve?did=${did}`);
    if (!response.ok) {
      throw new Error("Failed to resolve DID");
    }
    return response.json();
  }

  async referenceProfile(url: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/reference?url=${url}`);
    if (!response.ok) {
      throw new Error("Failed to reference profile");
    }
    return response.json();
  }

  async storeProfile(profile: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/profiles`, {
      method: "POST",
      body: JSON.stringify(profile),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to store profile");
    }
    return response.json();
  }

  async getProfiles(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/profiles`);
    if (!response.ok) {
      throw new Error("Failed to get profiles");
    }
    return response.json();
  }
}

const profileAPI = new ProfileAPI("http://localhost:3000/api");

const validate = () => {
  console.log("DOM content loaded");
  try {
    if (!document) {
      throw new Error("Document not found");
    }

    const validateButton = document.getElementById("validateButton");
    if (!validateButton) {
      throw new Error("Validate button not found");
    }

    validateButton.addEventListener("click", async () => {
      console.log("validating");
      const profileData = document.getElementById("profileData");
      if (!profileData) {
        document.getElementById("validationResult")!.textContent =
          "Profile data not found";
      }

      // @ts-ignore
      const profileDataText = profileData.value;
      try {
        const profileData = JSON.parse(profileDataText);
        const isValid = SchemaValidator.validate(profileData);
        if (isValid) {
          document.getElementById("validationResult")!.textContent =
            "Profile is valid";
        } else {
          document.getElementById("validationResult")!.textContent =
            "Profile is not valid";
        }
      } catch (error) {
        document.getElementById("validationResult")!.textContent =
          "Error parsing profile data: " + error;
      }
    });
  } catch (error) {
    alert("Error: " + error);
  }
};

const resolvers = () => {
  console.log("adding resolvers");
  document.getElementById("resolveDID")?.addEventListener("click", async () => {
    const resolvedDIDResult = document.getElementById("resolvedDIDResult");
    if (!resolvedDIDResult) {
      alert("DOM Element not found for resolvedDIDResult");
    }

    try {
      const didInput = document.getElementById("didInput");
      if (!didInput) {
        resolvedDIDResult!.textContent = "DID input not found";
      }
      // @ts-ignore
      const did = didInput.value;
      console.log("Resolving DID: ", did);
      const doc = await resolveDID(did);
      if (!doc || !doc.service || doc.service.length === 0) {
        resolvedDIDResult!.textContent = "DID not resolved";
      }

      const profile = await fetchServiceProfile(
        doc.service[0].serviceEndpoint.profile,
      );

      resolvedDIDResult!.textContent = JSON.stringify(profile, null, 2);
      //const resolved = await profileAPI.resolveDID(did);
    } catch (error) {
      if (!resolvedDIDResult) {
        alert("Error: " + error);
      }
      resolvedDIDResult!.textContent = "Error resolving DID: " + error;
    }
  });
};

const reference = () => {
  console.log("adding resolvers");
  document
    .getElementById("referenceProfile")
    ?.addEventListener("click", async () => {
      const resolvedProfileResult = document.getElementById(
        "referenceProfileResult",
      );
      try {
        const urlInput = document.getElementById("referenceProfileInput");
        if (!urlInput) {
          resolvedProfileResult!.textContent = "URL input not found";
        }
        console.log(urlInput);
        // @ts-ignore
        const url = urlInput.value;
        const resolved = await profileAPI.referenceProfile(url);
        console.log(resolved);
        if (!resolvedProfileResult) {
          alert("Resolved DID: " + JSON.stringify(resolved, null, 2));
        }
        resolvedProfileResult!.textContent = JSON.stringify(resolved, null, 2);
      } catch (error) {
        if (!resolvedProfileResult) {
          alert("Error: " + error);
        }
        resolvedProfileResult!.textContent = "Error resolving DID: " + error;
      }
    });
};

const getProfiles = async () => {
  const profiles = await profileAPI.getProfiles();
  const selectElement = document.getElementById("profileSelect");
  if (!selectElement) {
    throw new Error("Profile select not found");
  }
  profiles.forEach((profile: any) => {
    const option = document.createElement("option");
    option.value = profile.id;
    option.text = profile.name;
    selectElement.appendChild(option);
  });

  selectElement.addEventListener("change", async () => {
    // @ts-ignore
    const profileId = selectElement.value;
    console.log("Selected profile: ", profileId);
    const profile = await profileAPI.getProfile(profileId);
    const profileResult = document.getElementById("selectedProfileResult");
    if (!profileResult) {
      throw new Error("Profile result not found");
    }
    profileResult.textContent = JSON.stringify(profile, null, 2);
  });
};

const storeProfile = () => {
  try {
    if (!document) {
      throw new Error("Document not found");
    }
    const storeProfileButton = document.getElementById("storeProfileButton");
    if (!storeProfileButton) {
      throw new Error("Store button not found");
    }

    storeProfileButton.addEventListener("click", async () => {
      const storeProfileResult = document.getElementById("storeProfileResult");
      const profileData = document.getElementById("storeProfileData");
      if (!profileData) {
        document.getElementById("storeProfileResult")!.textContent =
          "Store Profile Result";
      }
      // @ts-ignore
      const profileDataText = profileData.value;
      try {
        console.log("Profile data: ", profileDataText);
        const profileData = JSON.parse(profileDataText);
        console.log("Storing profile: ", profileData);
        const resp = await profileAPI.storeProfile(profileData);
        storeProfileResult!.textContent = JSON.stringify(resp, null, 2);
      } catch (error) {
        storeProfileResult!.textContent =
          "Error parsing profile data: " + error;
      }
    });
  } catch (error) {
    alert("Error: " + error);
  }
};

const setup = () => {
  validate();
  resolvers();
  reference();
  storeProfile();
  getProfiles();
};

document.addEventListener("DOMContentLoaded", () => {
  console.log("adding listeners");
  setup();
});
