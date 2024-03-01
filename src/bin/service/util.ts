import { ServiceProfile } from "../../lib/models.js";

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
