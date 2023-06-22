import p from "node:path";

export const upCommand = {
  name: "up",
  run: (currentLocation) => p.resolve(currentLocation, ".."),
};
