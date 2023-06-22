import p from "node:path";
import fsP from "node:fs/promises";
import crypto from "node:crypto";

export const hashCommand = {
  name: "hash",
  args: 1,
  run: async (currentLocation, args) => {
    const [rawPathToFile] = args;

    const pathToFile = p.resolve(currentLocation, p.normalize(rawPathToFile));
    const fileContent = await fsP.readFile(pathToFile);

    const hash = crypto.createHash("sha256");
    hash.update(fileContent);

    console.log(hash.digest("hex"));
  },
};
