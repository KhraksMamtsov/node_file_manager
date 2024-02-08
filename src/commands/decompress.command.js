import p from "node:path";
import stream from "node:stream/promises";
import fs from "node:fs";
import z from "node:zlib";

export const decompressCommand = {
  name: "decompress",
  description: "Decompress file using Brotli algorithm.",
  args: ["path_to_file", "path_to_destination"],
  run: async (args) => {
    const [rawPathToFile, rawPathToDestination] = args;

    const pathToFile = p.resolve(process.cwd(), p.normalize(rawPathToFile));
    const pathToDestination = p.resolve(
      process.cwd(),
      p.normalize(rawPathToDestination)
    );

    await stream.pipeline(
      fs.createReadStream(pathToFile),
      z.createBrotliDecompress(),
      fs.createWriteStream(pathToDestination)
    );
  },
};
