import os from "node:os";

export const osCommand = {
  name: "os",
  subCommand: ["EOL", "cpus", "homedir", "username", "architecture"],
  run: (currentLocation, _, subCommand) => {
    const subCommandMap = {
      EOL: () => console.log(JSON.stringify(os.EOL)),
      cpus: () => console.log(os.cpus()),
      homedir: () => console.log(os.homedir()),
      username: () => console.log(os.userInfo().username),
      architecture: () => console.log(os.arch()),
    };

    return subCommandMap[subCommand]();
  },
};
