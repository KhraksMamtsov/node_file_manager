import p from "node:path";
import fsP from "node:fs/promises";

export const rnCommand = {
  name: "rn",
  args: 2,
  run: async (currentLocation, args) => {
    const [additionalPath, newName] = args;
    const path = p.resolve(currentLocation, p.normalize(additionalPath));
    const newPath = p.join(p.dirname(path), p.normalize(newName));

    await fsP.rename(path, newPath);
  },
};
