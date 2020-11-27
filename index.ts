import { Keypress, readKeypress } from "./keypress/mod.ts";

function isPrint(char: string) {
  // only needed until unicode category support is added for regex in Deno
  // /^\p{Alphabetic}$/u
  const regex = /^[ -~¡-¬®-ͷͺ-Ϳ΄-ΊΌΎ-Ρ Σ-ԯԱ-Ֆՙ-֊֍-֏֑-ׇא-תׯ-״ ؆-؛؞-ۜ۞-܍ܐ-݊ݍ-ޱ߀-ߺ߽-࠭ ࠰-࠾ࡀ-࡛࡞ࡠ-ࡪࢠ-ࢴࢶ-ࢽ࣓-ࣣ࣡-ঃ অ-ঌএঐও-নপ-রলশ-হ়-ৄেৈো-ৎৗ ড়ঢ়য়-ৣ০-৾ਁ-ਃਅ-ਊਏਐਓ-ਨਪ-ਰ ਲਲ਼ਵਸ਼ਸਹ਼ਾ-ੂੇੈੋ-੍ੑਖ਼-ੜਫ਼੦-੶ઁ-ઃ અ-ઍએ-ઑઓ-નપ-રલળવ-હ઼-ૅે-ૉો-્ ૐૠ-ૣ૦-૱ૹ-૿ଁ-ଃଅ-ଌଏଐଓ-ନ ପ-ରଲଳଵ-ହ଼-ୄେୈୋ-୍ୖୗଡ଼ଢ଼ୟ-ୣ ୦-୷ஂஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணத ந-பம-ஹா-ூெ-ைொ-்ௐௗ௦-௺ఀ-ఌ ఎ-ఐఒ-నప-హఽ-ౄె-ైొ-్ౕౖౘ-ౚ ౠ-ౣ౦-౯౷-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹ಼-ೄೆ-ೈೊ-್ೕೖ ೞೠ-ೣ೦-೯ೱೲഀ-ഃഅ-ഌഎ-ഐഒ-ൄെ-ൈൊ-൏ ൔ-ൣ൦-ൿංඃඅ-ඖක-නඳ-රලව-ෆ්ා-ුූෘ-ෟ ෦-෯ෲ-෴ก-ฺ฿-๛ກຂຄຆ-ຊຌ-ຣ ລວ-ຽເ-ໄໆ່-ໍ໐-໙ໜ-ໟༀ-ཇཉ-ཬཱ-ྗྙ-ྼ ྾-࿌࿎-࿚က-ჅჇჍა-ቈቊ-ቍቐ-ቖቘ ቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅ ወ-ዖዘ-ጐጒ-ጕጘ-ፚ፝-፼ᎀ-᎙Ꭰ-Ᏽ ᏸ-ᏽ᐀-ᙿᚁ-᚜ᚠ-ᛸᜀ-ᜌᜎ-᜔ᜠ-᜶ ᝀ-ᝓᝠ-ᝬᝮ-ᝰᝲᝳក-៝០-៩៰-៹᠀-᠐-᠙ ᠠ-ᡸᢀ-ᢪᢰ-ᣵᤀ-ᤞᤠ-ᤫᤰ-᤻᥀᥄-ᥭ ᥰ-ᥴᦀ-ᦫᦰ-ᧉ᧐-᧚᧞-ᨛ᨞-ᩞ᩠-᩿᩼-᪉ ᪐-᪙᪠-᪭᪰-᪾ᬀ-ᭋ᭐-᭼ᮀ-᯳᯼-᰷ ᰻-᱉ᱍ-ᲈᲐ-ᲺᲽ-᳇᳐-ᳺᴀ-᷹᷻-ἕ Ἐ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴ ᾶ-ῄῆ-ΐῖ-Ί῝-`ῲ-ῴῶ-῾‐-‧ ‰-⁞⁰ⁱ⁴-₎ₐ-ₜ₠-₿⃐-⃰℀-↋←-␦ ⑀-⑊①-⭳⭶-⮕⮘-Ⱞⰰ-ⱞⱠ-ⳳ⳹-ⴥ ⴧⴭⴰ-ⵧⵯ⵰⵿-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾ ⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞⷠ-⹏⺀-⺙⺛-⻳ ⼀-⿕⿰-⿻、-〿ぁ-ゖ゙-ヿㄅ-ㄯㄱ-ㆎ ㆐-ㆺ㇀-㇣ㇰ-㈞㈠-㋾㌀-䶵䷀-鿯ꀀ-ꒌ ꒐-꓆ꓐ-ꘫꙀ-꛷꜀-ꞿꟂ-Ᶎꟷ-꠫꠰-꠹ ꡀ-꡷ꢀ-ꣅ꣎-꣙꣠-꥓꥟-ꥼꦀ-꧍ꧏ-꧙ ꧞-ꧾꨀ-ꨶꩀ-ꩍ꩐-꩙꩜-ꫂꫛ-꫶ꬁ-ꬆ ꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭧꭰ-꯭꯰-꯹ 가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗ יִ-זּטּ-לּמּנּסּףּפּצּ-﯁ﯓ-﴿ﵐ-ﶏﶒ-ﷇ ﷰ-﷽-︙︠-﹒﹔-﹦﹨-﹫ﹰ-ﹴﹶ-ﻼ！-ﾾ ￂ-ￇￊ-ￏￒ-ￗￚ-ￜ￠-￦￨-￮￼�𐀀-𐀋 𐀍-𐀦𐀨-𐀺𐀼𐀽𐀿-𐁍𐁐-𐁝𐂀-𐃺𐄀-𐄂𐄇-𐄳 𐄷-𐆎𐆐-𐆛𐆠𐇐-𐇽𐊀-𐊜𐊠-𐋐𐋠-𐋻𐌀-𐌣 𐌭-𐍊𐍐-𐍺𐎀-𐎝𐎟-𐏃𐏈-𐏕𐐀-𐒝𐒠-𐒩 𐒰-𐓓𐓘-𐓻𐔀-𐔧𐔰-𐕣𐕯𐘀-𐜶𐝀-𐝕𐝠-𐝧 𐠀-𐠅𐠈𐠊-𐠵𐠷𐠸𐠼𐠿-𐡕𐡗-𐢞𐢧-𐢯𐣠-𐣲 𐣴𐣵𐣻-𐤛𐤟-𐤹𐤿𐦀-𐦷𐦼-𐧏𐧒-𐨃𐨅𐨆𐨌-𐨓 𐨕-𐨗𐨙-𐨵𐨸-𐨿𐨺-𐩈𐩐-𐩘𐩠-𐪟𐫀-𐫦 𐫫-𐫶𐬀-𐬵𐬹-𐭕𐭘-𐭲𐭸-𐮑𐮙-𐮜𐮩-𐮯 𐰀-𐱈𐲀-𐲲𐳀-𐳲𐳺-𐴧𐴰-𐴹𐹠-𐹾𐼀-𐼧 𐼰-𐽙𐿠-𐿶𑀀-𑁍𑁒-𑁯𑁿-𑂼𑂾-𑃁𑃐-𑃨 𑃰-𑃹𑄀-𑄴𑄶-𑅆𑅐-𑅶𑆀-𑇍𑇐-𑇟𑇡-𑇴 𑈀-𑈑𑈓-𑈾𑊀-𑊆𑊈𑊊-𑊍𑊏-𑊝𑊟-𑊩𑊰-𑋪 𑋰-𑋹𑌀-𑌃𑌅-𑌌𑌏𑌐𑌓-𑌨𑌪-𑌰𑌲𑌳𑌵-𑌹𑌻-𑍄𑍇𑍈𑍋-𑍍 𑍐𑍗𑍝-𑍣𑍦-𑍬𑍰-𑍴𑐀-𑑙𑑛𑑝-𑑟𑒀-𑓇 𑓐-𑓙𑖀-𑖵𑖸-𑗝𑘀-𑙄𑙐-𑙙𑙠-𑙬𑚀-𑚸 𑛀-𑛉𑜀-𑜚𑜝-𑜫𑜰-𑜿𑠀-𑠻𑢠-𑣲𑣿𑦠-𑦧 𑦪-𑧗𑧚-𑧤𑨀-𑩇𑩐-𑪢𑫀-𑫸𑰀-𑰈𑰊-𑰶𑰸-𑱅 𑱐-𑱬𑱰-𑲏𑲒-𑲧𑲩-𑲶𑴀-𑴆𑴈𑴉𑴋-𑴶𑴺𑴼𑴽𑴿-𑵇 𑵐-𑵙𑵠-𑵥𑵧𑵨𑵪-𑶎𑶐𑶑𑶓-𑶘𑶠-𑶩𑻠-𑻸 𑿀-𑿱𑿿-𒎙𒐀-𒑮𒑰-𒑴𒒀-𒕃𓀀-𓐮𔐀-𔙆 𖠀-𖨸𖩀-𖩞𖩠-𖩩𖩮𖩯𖫐-𖫭𖫰-𖫵𖬀-𖭅𖭐-𖭙 𖭛-𖭡𖭣-𖭷𖭽-𖮏𖹀-𖺚𖼀-𖽊𖽏-𖾇𖾏-𖾟 𖿠-𖿣𗀀-𘟷𘠀-𘫲𛀀-𛄞𛅐-𛅒𛅤-𛅧𛅰-𛋻 𛰀-𛱪𛱰-𛱼𛲀-𛲈𛲐-𛲙𛲜-𛲟𝀀-𝃵𝄀-𝄦 𝄩-𝅲𝅻-𝇨𝈀-𝉅𝋠-𝋳𝌀-𝍖𝍠-𝍸𝐀-𝑔 𝑖-𝒜𝒞𝒟𝒢𝒥𝒦𝒩-𝒬𝒮-𝒹𝒻𝒽-𝓃𝓅-𝔅 𝔇-𝔊𝔍-𝔔𝔖-𝔜𝔞-𝔹𝔻-𝔾𝕀-𝕄𝕆𝕊-𝕐 𝕒-𝚥𝚨-𝟋𝟎-𝪋𝪛-𝪟𝪡-𝪯𞀀-𞀆𞀈-𞀘𞀛-𞀡𞀣𞀤𞀦-𞀪 𞄀-𞄬𞄰-𞄽𞅀-𞅉𞅎𞅏𞋀-𞋹𞋿𞠀-𞣄𞣇-𞣖 𞤀-𞥋𞥐-𞥙𞥞𞥟𞱱-𞲴𞴁-𞴽𞸀-𞸃𞸅-𞸟𞸡 𞸢𞸤𞸧𞸩-𞸲𞸴-𞸷𞸹𞸻𞹂𞹇𞹉𞹋𞹍-𞹏𞹑𞹒𞹔 𞹗𞹙𞹛𞹝𞹟𞹡𞹢𞹤𞹧-𞹪𞹬-𞹲𞹴-𞹷𞹹-𞹼𞹾 𞺀-𞺉𞺋-𞺛𞺡-𞺣𞺥-𞺩𞺫-𞺻𞻰𞻱🀀-🀫🀰-🂓 🂠-🂮🂱-🂿🃁-🃏🃑-🃵🄀-🄌🄐-🅬🅰-🆬🇦-🈂 🈐-🈻🉀-🉈🉐🉑🉠-🉥🌀-🛕🛠-🛬🛰-🛺🜀-🝳 🞀-🟘🟠-🟫🠀-🠋🠐-🡇🡐-🡙🡠-🢇🢐-🢭 🤀-🤋🤍-🥱🥳-🥶🥺-🦢🦥-🦪🦮-🧊🧍-🩓 🩠-🩭🩰-🩳🩸-🩺🪀-🪂🪐-🪕𠀀-𪛖𪜀-𫜴 𫝀-𫠝𫠠-𬺡𬺰-𮯠丽-𪘀-]$/u;
  return regex.test(char);
}

export async function readInput({
  stdin = Deno.stdin,
  stdout = Deno.stdout,
  prefix = "",
  valid = isPrint,
  endInput = ["return", "\x03", "\x04"],
} = {}): Promise<[string, Keypress | undefined]> {
  const encoder = new TextEncoder();
  const minCursor = prefix.length + 1;
  var lines: string[] = [];
  var input = "";
  var cursor = minCursor;
  stdout.write(encoder.encode(prefix));
  for await (const keypress of readKeypress(stdin)) {
    switch (keypress.key) {
      case "up":
      case "down":
        continue;
      //deno-lint-ignore no-fallthrough
      case "backspace":
        input =
          input.substring(0, cursor - minCursor - 1) +
          input.substring(cursor - minCursor);
      case "left":
        cursor = cursor <= minCursor ? minCursor : cursor - 1;
        break;
      case "right":
        cursor =
          cursor >= minCursor + input.length
            ? minCursor + input.length
            : cursor + 1;
        break;
      case "delete":
        input =
          input.substring(0, cursor - minCursor) +
          input.substring(cursor + 1 - minCursor);
        break;
      case "return":
        if (!endInput.includes("return") && !endInput.includes("\r")) {
          lines.push(input);
          input = "";
          cursor = minCursor;
          stdout.write(encoder.encode("\n"));
        }
        break;
      default:
        if (
          !(keypress.ctrlKey || keypress.metaKey) &&
          keypress.key &&
          valid(keypress.sequence)
        ) {
          input =
            input.substring(0, cursor - minCursor) +
            keypress.sequence +
            input.substring(cursor - minCursor);
          cursor++;
        }
    }
    await stdout.write(
      encoder.encode(`\r\u001B[2K${prefix}${input}\u001B[${cursor}G`)
    );
    if (
      endInput.includes(keypress.sequence) ||
      (keypress.key && endInput.includes(keypress.key))
    ) {
      await stdout.write(encoder.encode("\n"));
      if (input.length > 0 || lines.length == 0) lines.push(input);
      return [lines.join("\n"), keypress];
    }
  }
  throw "You should not be able to get here";
}
