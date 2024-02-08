import { gray, cyan } from "./console.js";

export function help(command) {
  console.group(cyan(command.name), gray(`${command.description}`));

  command.subCommand?.forEach((subCommand) => {
    console.log(
      cyan(command.name),
      cyan.dark("--" + subCommand.name),
      gray(subCommand.description)
    );
  });

  if (command.args) {
    console.log(
      cyan(command.name),
      ...command.args.map((arg) => cyan.dark(arg))
    );
  }

  console.groupEnd();
}
