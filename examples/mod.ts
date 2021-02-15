import { color } from "../dev_deps.ts";
import { readInput } from "../mod.ts";
import { basicCompletion, basicHighlighter, generateKeyMap } from "../utils.ts";

console.log(
  'Single Line Input, tab completes "hello", "hell" and "Im" to "I\'m":',
);
console.log(
  ", result: \n" +
    (
      await readInput({
        keyMap: generateKeyMap(1, {
          completion: basicCompletion(["hello", "hell", ["Im", "I'm"]]),
        }),
      })
    ),
);

console.log("Multi Line Input:");
console.log(
  "result: \n" +
    (
      await readInput({
        keyMap: generateKeyMap(5),
        highlighter: basicHighlighter(
          new Map<
            string | RegExp | (string | RegExp)[],
            ((input: string) => string) | ((input: string) => string)[]
          >(
            [
              [["{", "}"], [color.bold, color.dim]],
              [["I", "you", "they"], color.italic],
            ],
          ),
        ),
      })
    ),
);
