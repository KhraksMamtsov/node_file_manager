import p from "node:path";
import stream from "node:stream/promises";
import fs from "node:fs";
import z from "node:zlib";
import { assertPathWithType } from "../isExist.js";

export const decompressCommand = {
  name: "decompress",
  description: "Decompress file using Brotli algorithm.",
  args: ["path_to_file", "path_to_destination"],
  run: async (currentLocation, args) => {
    const [rawPathToFile, rawPathToDestination] = args;

    const pathToFile = p.resolve(currentLocation, p.normalize(rawPathToFile));
    const pathToDestination = p.resolve(
      currentLocation,
      p.normalize(rawPathToDestination)
    );

    await assertPathWithType({
      checkPath: pathToFile,
      type: "file",
    });

    await stream.pipeline(
      fs.createReadStream(pathToFile),
      z.createBrotliDecompress(),
      fs.createWriteStream(pathToDestination)
    );
  },
};
