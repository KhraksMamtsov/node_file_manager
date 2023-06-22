import p from "node:path";
import stream from "node:stream/promises";
import fs from "node:fs";
import z from "node:zlib";

export const compressCommand = {
  name: "compress",
  args: 2,
  run: async (currentLocation, args) => {
    const [rawPathToFile, rawPathToDestination] = args;

    const pathToFile = p.resolve(currentLocation, p.normalize(rawPathToFile));
    const pathToDestination = p.resolve(
      currentLocation,
      p.normalize(rawPathToDestination)
    );

    await stream.pipeline(
      fs.createReadStream(pathToFile),
      z.createBrotliCompress(),
      fs.createWriteStream(pathToDestination)
    );
  },
};
