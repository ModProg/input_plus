import { readInput } from "./mod.ts";
import { generateKeyMap } from "./utils.ts";
console.log("Single Char Input:");
console.log("Human? [Y/N]:");
if (
  "y" == (await readInput(
    {
      keyMap: new Map(
        [[
          /[yn]/i,
          ({ key }) => ({ input: key.key?.toLowerCase(), endinput: true }),
        ]],
      ),
    },
  ))
) {
  console.log("Sure about that?");
} else {
  console.log("Me neither.");
}

console.log("Single Line Input:");
console.log(
  ", result: \n" +
    (
      await readInput({
        keyMap: generateKeyMap(1),
      })
    ),
);

console.log("Multi Line Input:");
console.log(
  "result: \n" +
    (
      await readInput({
        keyMap: generateKeyMap(5),
      })
    ),
);
