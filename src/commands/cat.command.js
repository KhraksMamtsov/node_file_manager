import p from "node:path";
import fs from "node:fs";
import os from "node:os";
import { cyan } from "../console.js";

export const catCommand = {
  name: "cat",
  description: "Read file and print it's content in console.",
  args: ["path_to_file"],
  run: async (args) => {
    const [rawPathToFile] = args;

    const pathToFile = p.resolve(process.cwd(), p.normalize(rawPathToFile));

    await new Promise((resolve, reject) => {
      const stream = fs.createReadStream(pathToFile);

      stream
        .on("data", (chunk) => {
          process.stdout.write(cyan(chunk.toString()));
        })
        .on("error", (e) => {
          reject(e);
        })
        .on("end", () => {
          process.stdout.write(os.EOL);
          resolve();
        });
    });
  },
};
