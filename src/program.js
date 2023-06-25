import { cyan, magenta } from "./console.js";
import os from "node:os";
import readline from "node:readline/promises";
import { handleCommand, renderGlobalHelp } from "./commandHandler.js";

const ARGUMENTS_DELIMITER = "=";
const KEY_PREFIX = "--";

function parseProgramArgs() {
  const [_execPath, _execFile, ...args] = process.argv;
  return Object.fromEntries(
    args.flatMap((arg) => {
      const [rawKey, ...splittedValue] = arg.split(ARGUMENTS_DELIMITER);

      if (!rawKey.startsWith(KEY_PREFIX) || rawKey === KEY_PREFIX) {
        return [];
      }

      const parsedKey = rawKey.slice(KEY_PREFIX.length);

      return [[parsedKey, splittedValue.join(ARGUMENTS_DELIMITER)]];
    })
  );
}

function onExit(args) {
  args.rl.close();
  console.log(
    magenta.dark("Thank you for using File Manager,"),
    cyan(args.userName),
    magenta.dark(", goodbye!")
  );
  process.exit();
}

function locator() {
  console.log(magenta.dark("You are currently in"), magenta(process.cwd()));
}

export async function program() {
  const parsedArguments = parseProgramArgs(process.argv);
  const userName = parsedArguments.username || "Anonymous";

  console.log(
    magenta.dark("Welcome to the File Manager,"),
    cyan(userName),
    magenta.dark("!")
  );
  process.chdir(os.homedir());
  locator();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });

  rl.on("SIGINT", function () {
    onExit({ rl, userName });
  });
  rl.on("close", () => {
    onExit({ rl, userName });
  });

  rl.on("line", async (nextCommand) => {
    if (nextCommand.trim() === ".exit") {
      return rl.close();
    }

    if (nextCommand.trim() === "-help") {
      renderGlobalHelp();
      locator();
      return;
    }

    await handleCommand({
      command: nextCommand,
    });

    locator();
  });
}
