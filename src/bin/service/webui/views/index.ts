// index.ts
import { SchemaValidator } from "../../../lib/validator";

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM content loaded");
  try {
    if (!document) {
      throw new Error("Document not found");
    }

    const validateButton = document.getElementById("validateButton");
    if (!validateButton) {
      throw new Error("Validate button not found");
    }

    validateButton.addEventListener("click", function () {
      console.log("Validating profile data");
      const profileData = document.getElementById("profileData");
      if (!profileData) {
        throw new Error("Profile data not found");
      }
      // @ts-ignore
      const profileDataText = profileData.value;
      try {
        const profileData = JSON.parse(profileDataText);
        const isValid = SchemaValidator.validate(profileData); // Replace this with your actual validation logic
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
});
