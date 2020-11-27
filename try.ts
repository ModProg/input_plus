import { readInput } from "./index.ts";
console.log("Single Line Input:");
console.log("result: \n" + (await readInput())[0]);

console.log("Multi Line Input:");
console.log(
  "result: \n" +
    (
      await readInput({
        prefix: "> ",
        endInput: ["\x04"],
      })
    )[0]
);
