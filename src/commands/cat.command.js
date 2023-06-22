import p from "node:path";
import fs from "node:fs";
import os from "node:os";
import stream from "node:stream/promises";

export const catCommand = {
  name: "cat",
  args: 1,
  run: async (currentLocation, args) => {
    const [rawPathToFile] = args;

    const pathToFile = p.resolve(currentLocation, p.normalize(rawPathToFile));

    const asd = fs //
      .createReadStream(pathToFile)
      .on("error")
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
