import { ynInput } from "../extensions.ts";

if (
  await ynInput("Is this a good example?", "y")
) {
  console.log("Oh, thank you so much!");
} else {
  console.log("Wrong, all my examples are perfect!");
}
