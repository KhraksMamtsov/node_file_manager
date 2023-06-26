import p from "node:path";
import fs from "node:fs";
import stream from "node:stream/promises";

export const cpCommand = {
  name: "cp",
  description: "Copy file.",
  args: ["path_to_file", "path_to_new_directory"],
  run: async (args) => {
    const [pathToFile, pathToNewDirectory] = args;
    const fromPath = p.resolve(process.cwd(), p.normalize(pathToFile));
    const toPath = p.resolve(process.cwd(), p.normalize(pathToNewDirectory));

    await stream.pipeline(
      fs.createReadStream(fromPath),
      fs.createWriteStream(toPath)
    );
  },
};
