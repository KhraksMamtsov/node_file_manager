import p from "node:path";
import fs from "node:fs";
import fsP from "node:fs/promises";
import stream from "node:stream/promises";

export const mvCommand = {
  name: "mv",
  description: "Move file.",
  args: ["path_to_file", "path_to_new_directory"],
  run: async (args) => {
    const [pathToFile, pathToNewDirectory] = args;
    const fromPath = p.resolve(process.cwd(), p.normalize(pathToFile));

    const toPath = p.resolve(
      process.cwd(),
      p.normalize(pathToNewDirectory),
      p.basename(fromPath)
    );

    await stream.pipeline(
      fs.createReadStream(fromPath),
      fs.createWriteStream(toPath)
    );

    await fsP.rm(fromPath);
  },
};
