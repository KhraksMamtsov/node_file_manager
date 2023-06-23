import p from "node:path";
import fs from "node:fs";
import stream from "node:stream/promises";

export const cpCommand = {
  name: "cp",
  args: ['path to file', 'path to new directory'],
  run: async (currentLocation, args) => {
    const [pathToFile, pathToNewDirectory] = args;
    const fromPath = p.resolve(currentLocation, p.normalize(pathToFile));
    const toPath = p.resolve(currentLocation, p.normalize(pathToNewDirectory));

    await stream.pipeline(
      fs.createReadStream(fromPath),
      fs.createWriteStream(toPath)
    );
  },
};
