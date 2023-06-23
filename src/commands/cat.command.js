import p from "node:path";
import fs from "node:fs";
import os from "node:os";
import stream from "node:stream/promises";
import { assertPathWithType } from "../isExist.js";

export const catCommand = {
  name: "cat",
  description: "Read file and print it's content in console.",
  args: ["path_to_file"],
  run: async (args) => {
    const [rawPathToFile] = args;

    const pathToFile = p.resolve(process.cwd(), p.normalize(rawPathToFile));
    console.log(pathToFile);
    await assertPathWithType({
      checkPath: pathToFile,
      type: "file",
    });
    console.log(123, pathToFile);

    const asd = fs //
      .createReadStream(pathToFile)
      .pipe(process.stdout)
      .on("error", (e) => {
        console.log(e);
        throw e;
      });

    process.stdout.write(os.EOL);

    await stream.finished(asd);

    console.log(123123123123);
  },
};
