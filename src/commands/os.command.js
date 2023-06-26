import os from "node:os";
import { cyan } from "../console.js";

const QUANTITY_TITLE = "Quantity";
const FREQUENCY_TITLE = "Frequency";
const MODEL_TITLE = "Model";

export const osCommand = {
  name: "os",
  description: "Operating system info.",
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
  run: (_, subCommandName) => {
    const subCommandMap = {
      EOL: () => console.log(cyan(JSON.stringify(os.EOL))),
      cpus: () => {
        const grouppedCPUS = os.cpus().reduce((acc, cpu) => {
          const key = `${cpu.speed}${cpu.model}`;
          if (acc[key] === undefined) {
            acc[key] = [cpu];
          } else {
            acc[key].push(cpu);
          }
          return acc;
        }, {});

        // header
        console.log(
          cyan.dark(QUANTITY_TITLE),
          cyan.dark(FREQUENCY_TITLE),
          cyan.dark(MODEL_TITLE)
        );

        // body
        Object.values(grouppedCPUS).forEach((cpus) => {
          const [cpu] = cpus;
          console.log(
            cyan(cpus.length.toString().padStart(QUANTITY_TITLE.length, " ")),
            cyan(
              `${cpu.speed / 1000}GHz`.padStart(FREQUENCY_TITLE.length),
              " "
            ),
            cyan(`${cpu.model}`)
          );
        });
      },
      homedir: () => console.log(cyan(os.homedir())),
      username: () => console.log(cyan(os.userInfo().username)),
      architecture: () => console.log(cyan(os.arch())),
    };

    return subCommandMap[subCommandName]();
  },
};
