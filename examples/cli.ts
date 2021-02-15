import { cliInput } from "../extensions.ts";

/**
 * Possible input:
 * > test
 * < it is working
 * > add 1 5 2
 * < 8
 * > + 1 2
 * < 3
 * > wtf
 * < This command does not exist!
 * < Maybe try something else.
 */
cliInput(
  [
    { keywords: "test", exec: () => "it is working" },
    {
      keywords: ["add", "+"],
      exec: (args) =>
        args.reduce((sum, e) => sum + Number.parseFloat(e), 0).toString(),
    },
    {
      keywords: "exit",
      exec: -1,
    },
  ],
  {
    errorMessage: "This command does not exist!\nMaybe try something else.",
    inputPre: "> ",
    outputPre: "< "
  },
);
