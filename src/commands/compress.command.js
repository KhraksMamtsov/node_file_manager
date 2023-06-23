import p from "node:path";
import stream from "node:stream/promises";
import fs from "node:fs";
import z from "node:zlib";
import { assertPathWithType } from "../isExist.js";

export const compressCommand = {
  name: "compress",
  description: "Compress file using Brotli algorithm.",
  args: ["path_to_file", "path_to_destination"],
  run: async (args) => {
    const [rawPathToFile, rawPathToDestination] = args;

    const pathToFile = p.resolve(
      //
      process.cwd(),
      p.normalize(rawPathToFile)
    );
    const pathToDestination = p.resolve(
      process.cwd(),
      p.normalize(rawPathToDestination)
    );

    await assertPathWithType({
      checkPath: pathToFile,
      type: "file",
    });

    await stream.pipeline(
      fs.createReadStream(pathToFile),
      z.createBrotliCompress(),
      fs.createWriteStream(pathToDestination)
    );
  },
};
