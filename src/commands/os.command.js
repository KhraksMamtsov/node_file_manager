import os from "node:os";

export const osCommand = {
  name: "os",
  description: "Operating system info",
  subCommand: [
    {
      name: "EOL",
      description:
        "Get EOL (default system End-Of-Line) and print it to console.",
    },
    {
      name: "cpus",
      description:
        "Get host machine CPUs info (overall amount of CPUS plus model and clock rate (in GHz) for each of them) and print it to console.",
    },
    {
      name: "homedir",
      description: "Get home directory and print it to console.",
    },
    {
      name: "username",
      description: "Get current system user name and print it to console.",
    },
    {
      name: "architecture",
      description:
        "Get CPU architecture for which Node.js binary has compiled and print it to console.",
    },
  ],
  run: (currentLocation, _, subCommandName) => {
    const subCommandMap = {
      EOL: () => console.log(JSON.stringify(os.EOL)),
      cpus: () => console.log(os.cpus()),
      homedir: () => console.log(os.homedir()),
      username: () => console.log(os.userInfo().username),
      architecture: () => console.log(os.arch()),
    };

    return subCommandMap[subCommandName]();
  },
};
