import fs from "fs/promises";
import { ServiceProfile } from "../../lib/models.js";

export const readFile = async (path: string): Promise<string> => {
  try {
    return await fs.readFile(path, "utf-8");
  } catch (error) {
    throw new Error(`Error reading file: ${error}`);
  }
};

export const fetchServiceProfile = async (
  url: string,
): Promise<ServiceProfile> => {
  const response = await fetch(url, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data as ServiceProfile;
};
