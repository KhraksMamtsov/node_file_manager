import p from "node:path";

export const upCommand = {
  name: "up",
  description: "Go upper from current directory.",
  run: (currentLocation) => p.resolve(currentLocation, ".."),
};
