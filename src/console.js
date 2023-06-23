export function green(str) {
  return `\x1b[92m${str}\x1b[0m`;
}
green.dark = function (str) {
  return `\x1b[32m${str}\x1b[0m`;
};

export function gray(str) {
  return `\x1b[90m${str}\x1b[0m`;
}
export function magenta(str) {
  return `\x1b[95m${str}\x1b[0m`;
}
magenta.dark = function (str) {
  return `\x1b[35m${str}\x1b[0m`;
};
export function cyan(str) {
  return `\x1b[96m${str}\x1b[0m`;
}
cyan.open = function () {
  return `\x1b[96m`;
};
cyan.close = function () {
  return `\x1b[0m`;
};
cyan.dark = function (str) {
  return `\x1b[36m${str}\x1b[0m`;
};
export function red(str) {
  return `\x1b[91m${str}\x1b[0m`;
}
red.dark = function () {
  return `\x1b[31m${str}\x1b[0m`;
};
