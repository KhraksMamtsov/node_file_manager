import p from "node:path";
import fsP from "node:fs/promises";

export const addCommand = {
  name: "add",
  args: 1,
  run: async (currentLocation, args) => {
    const [filename] = args;
    const path = p.resolve(currentLocation, p.normalize(filename));
    await fsP.writeFile(path, "");
  },
};
