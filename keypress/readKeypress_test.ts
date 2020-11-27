import { readKeypress } from "./mod.ts";

for await (const keypress of readKeypress()) {
    console.log(keypress);

    if (keypress.ctrlKey && keypress.key === 'd') {
        Deno.exit(0);
    }
}
