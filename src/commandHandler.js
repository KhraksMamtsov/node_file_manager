import { addCommand } from "./commands/add.command.js";
import { cdCommand } from "./commands/cd.command.js";
import { rmCommand } from "./commands/rm.command.js";
import { upCommand } from "./commands/up.command.js";
import { rnCommand } from "./commands/rn.command.js";
import { catCommand } from "./commands/cat.command.js";
import { lsCommand } from "./commands/ls.command.js";
import { compressCommand } from "./commands/compress.command.js";
import { decompressCommand } from "./commands/decompress.command.js";
import { hashCommand } from "./commands/hash.command.js";
import { osCommand } from "./commands/os.command.js";
import { cpCommand } from "./commands/cp.command.js";
import { help } from "./command.js";
import { red } from "./console.js";
import * as PR from "./parseResult.js";
import { mvCommand } from "./commands/mv.command.js";

const knownCommands = [
  upCommand,
  cdCommand,
  lsCommand,
  catCommand,
  addCommand,
  rnCommand,
  cpCommand,
  mvCommand,
  rmCommand,
  osCommand,
  hashCommand,
  compressCommand,
  decompressCommand,
];

export function renderGlobalHelp() {
  knownCommands.forEach((knownCommand) => {
    console.log();
    help(knownCommand);
  });
}

export const HELP_SPECIAL_SYMBOLS = ["h", "help"];

export async function handleCommand(args) {
  const { command } = args;

  const parseResult = parseCommand({ rawCommand: command });

  if (PR.isError(parseResult)) {
    console.log(red("Invalid input"));
  } else if (PR.isSpecial(parseResult)) {
    if (parseResult.special === "help") {
      parseResult.commands.map((x) => help(x));
    }
  } else {
    const { command, args, subCommand } = parseResult;

    try {
      await command.run(args, subCommand);
    } catch (e) {
      console.log(red("Operation failed"));
    }
  }
}

const KEY_PREFIX = "--";
const SPECIALS_PREFIX = "-";

function parseCommandArgs(args) {
  return (args.match(/"[^"]+"|'[^']+'|\S+/g) ?? [])
    .map((x) => x.replaceAll(/["']/g, ""))
    .filter((x) => x !== "")
    .reduce(
      (acc, arg) => {
        if (arg.startsWith(KEY_PREFIX)) {
          const subCommand = arg.slice(KEY_PREFIX.length);
          acc.subCommands.push(subCommand);
        } else if (arg.startsWith(SPECIALS_PREFIX)) {
          acc.specials.push(arg.slice(SPECIALS_PREFIX.length));
        } else {
          acc.args.push(arg);
        }
        return acc;
      },
      { subCommands: [], args: [], specials: [] }
    );
}
function parseCommand(args) {
  const { rawCommand } = args;

  const [parsedName, ...parsedCommandArgs] = rawCommand
    .trim()
    .split(" ")
    .filter((x) => x !== "");
  const sortedArgs = parseCommandArgs(parsedCommandArgs.join(" "));

  const matchedCommandsByName = knownCommands.filter(
    (knownCommand) => knownCommand.name === parsedName
  );

  if (
    matchedCommandsByName.length === 1 &&
    sortedArgs.specials.some((s) => HELP_SPECIAL_SYMBOLS.includes(s))
  ) {
    return PR.help(matchedCommandsByName);
  }

  if (sortedArgs.subCommands.length > 1) {
    return PR.error("subCommands are more than one");
  }
  const [parsedSubCommand] = sortedArgs.subCommands;

  const matchedCommands = matchedCommandsByName
    .filter(
      (knownCommand) =>
        (knownCommand.args?.length ?? 0) === sortedArgs.args.length
    )
    .filter((knownCommand) => {
      if (knownCommand.subCommand === undefined) {
        return parsedSubCommand === undefined;
      } else {
        return knownCommand.subCommand.some((x) => x.name === parsedSubCommand);
      }
    });

  if (matchedCommands.length > 1) {
    return PR.error("Ambiguous command matching");
  } else if (matchedCommands.length < 1) {
    return PR.error("No matched commands");
  } else {
    const [targetCommand] = matchedCommands;

    return PR.command({
      command: targetCommand,
      args: sortedArgs.args,
      subCommand: parsedSubCommand,
    });
  }
}
