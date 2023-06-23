import p from "node:path";
import fsP from "node:fs/promises";
import { assertPathWithType } from "../isExist.js";

export const rmCommand = {
  name: "rm",
  description: "Delete file",
  args: ["path_to_file"],
  run: async (currentLocation, args) => {
    const [additionalPath] = args;
    const path = p.resolve(currentLocation, p.normalize(additionalPath));

    await assertPathWithType({
      checkPath: path,
      type: "file",
    });

    await fsP.rm(path);
  },
};
