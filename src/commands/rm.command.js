import p from "node:path";
import fsP from "node:fs/promises";

export const rmCommand = {
  name: "rm",
  args: 1,
  run: async (currentLocation, args) => {
    const [additionalPath] = args;
    const path = p.resolve(currentLocation, p.normalize(additionalPath));

    await fsP.rm(path);
  },
};
