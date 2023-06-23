import p from "node:path";
import fsP from "node:fs/promises";
import crypto from "node:crypto";
import { cyan } from "../console.js";

export const hashCommand = {
  name: "hash",
  description: "Calculate hash for file and print it into console.",
  args: ["path_to_file"],
  run: async (args) => {
    const [rawPathToFile] = args;

    const pathToFile = p.resolve(process.cwd(), p.normalize(rawPathToFile));

    const fileContent = await fsP.readFile(pathToFile);

    const hash = crypto //
      .createHash("sha256")
      .update(fileContent)
      .digest("hex");

    console.log(cyan(hash));
  },
};
