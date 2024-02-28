import fs from "fs/promises";

export const readFile = async (path: string): Promise<string> => {
  try {
    return await fs.readFile(path, "utf-8");
  } catch (error) {
    throw new Error(`Error reading file: ${error}`);
  }
};

export const fetchServiceProfile = async (url: string) => {
  console.log("featching service profile", url);
  await fetch(url, {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((error) => {
      console.error("Error resolving service:", error);
    });
};
