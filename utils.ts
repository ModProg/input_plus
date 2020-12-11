import { Keys, KeySpec } from "./helpers.ts";
import { KeyMap } from "./mod.ts";

export function basicHighlighter(
  highlighting: Map<
    (RegExp | string)[] | RegExp | string,
    (input: string) => string | ((input: string) => string)[]
  >,
): (input: string) => string {
  return (text) => text;
}

export function basicCompletion(
  completion: ([RegExp | string, string] | string)[],
  completeLine = false,
): (input: string) => string {
  return (text) => text;
}

export enum Key {
  return = "return",
  enter = "enter",
  tab = "tab",
  backspace = "backspace",
  escape = "escape",
  f1 = "f1",
  f2 = "f2",
  f3 = "f3",
  f4 = "f4",
  f5 = "f5",
  f6 = "f6",
  f7 = "7f",
  f8 = "f8",
  f9 = "f9",
  f10 = "f10",
  f11 = "f11",
  f12 = "f12",
  up = "up",
  down = "down",
  right = "right",
  left = "left",
  clear = "clear",
  end = "end",
  home = "home",
  insert = "insert",
  delete = "delete",
  pageup = "pageup",
  pagedown = "pagedown",
}

export function generateKeyMap(
  lineCount = 1,
  {
    validKeys = [
      // https://util.unicode.org/UnicodeJsps/regex.jsp?a=%5B%5B%3Agc%3DLetter%3A%5D%5B%3Agc%3DMark%3A%5D%5B%3Agc%3DNumber%3A%5D%5B%3Agc%3DPunctuation%3A%5D%5B%3Agc%3DSymbol%3A%5D%5D%0D%0A&b=%0D%0A
      /[!-~¡-¬®-ͷͺ-Ϳ΄-ΊΌΎ-ΡΣ-ԯԱ-Ֆՙ-֊֍-֏֑-ׇא-תׯ-״؆-؛؞-ۜ۞-܍ܐ-݊ݍ-ޱ߀-ߺ߽-࠭࠰-࠾ࡀ-࡛࡞ࡠ-ࡪࢠ-ࢴࢶ-ࢽ࣓-ࣣ࣡-ঃঅ-ঌএঐও-নপ-রলশ-হ়-ৄেৈো-ৎৗড়ঢ়য়-ৣ০-৾ਁ-ਃਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹ਼ਾ-ੂੇੈੋ-੍ੑਖ਼-ੜਫ਼੦-੶ઁ-ઃઅ-ઍએ-ઑઓ-નપ-રલળવ-હ઼-ૅે-ૉો-્ૐૠ-ૣ૦-૱ૹ-૿ଁ-ଃଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହ଼-ୄେୈୋ-୍ୖୗଡ଼ଢ଼ୟ-ୣ୦-୷ஂஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹா-ூெ-ைொ-்ௐௗ௦-௺ఀ-ఌఎ-ఐఒ-నప-హఽ-ౄె-ైొ-్ౕౖౘ-ౚౠ-ౣ౦-౯౷-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹ಼-ೄೆ-ೈೊ-್ೕೖೞೠ-ೣ೦-೯ೱೲഀ-ഃഅ-ഌഎ-ഐഒ-ൄെ-ൈൊ-൏ൔ-ൣ൦-ൿංඃඅ-ඖක-නඳ-රලව-ෆ්ා-ුූෘ-ෟ෦-෯ෲ-෴ก-ฺ฿-๛ກຂຄຆ-ຊຌ-ຣລວ-ຽເ-ໄໆ່-ໍ໐-໙ໜ-ໟༀ-ཇཉ-ཬཱ-ྗྙ-ྼ྾-࿌࿎-࿚က-ჅჇჍა-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚ፝-፼ᎀ-᎙Ꭰ-Ᏽᏸ-ᏽ᐀-ᙿᚁ-᚜ᚠ-ᛸᜀ-ᜌᜎ-᜔ᜠ-᜶ᝀ-ᝓᝠ-ᝬᝮ-ᝰᝲᝳក-៝០-៩៰-៹᠀-᠍᠐-᠙ᠠ-ᡸᢀ-ᢪᢰ-ᣵᤀ-ᤞᤠ-ᤫᤰ-᤻᥀᥄-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉ᧐-᧚᧞-ᨛ᨞-ᩞ᩠-᩿᩼-᪉᪐-᪙᪠-᪭᪰-᪾ᬀ-ᭋ᭐-᭼ᮀ-᯳᯼-᰷᰻-᱉ᱍ-ᲈᲐ-ᲺᲽ-᳇᳐-ᳺᴀ-᷹᷻-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ῄῆ-ΐῖ-Ί῝-`ῲ-ῴῶ-῾‐-‧‰-⁞⁰ⁱ⁴-₎ₐ-ₜ₠-₿⃐-⃰℀-↋←-␦⑀-⑊①-⭳⭶-⮕⮘-Ⱞⰰ-ⱞⱠ-ⳳ⳹-ⴥⴧⴭⴰ-ⵧⵯ⵰⵿-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞⷠ-⹏⺀-⺙⺛-⻳⼀-⿕⿰-⿻、-〿ぁ-ゖ゙-ヿㄅ-ㄯㄱ-ㆎ㆐-ㆺ㇀-㇣ㇰ-㈞㈠-㋾㌀-䶵䷀-鿯ꀀ-ꒌ꒐-꓆ꓐ-ꘫꙀ-꛷꜀-ꞿꟂ-Ᶎꟷ-꠫꠰-꠹ꡀ-꡷ꢀ-ꣅ꣎-꣙꣠-꥓꥟-ꥼꦀ-꧍ꧏ-꧙꧞-ꧾꨀ-ꨶꩀ-ꩍ꩐-꩙꩜-ꫂꫛ-꫶ꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭧꭰ-꯭꯰-꯹가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִ-זּטּ-לּמּנּסּףּפּצּ-﯁ﯓ-﴿ﵐ-ﶏﶒ-ﷇﷰ-﷽︀-︙︠-﹒﹔-﹦﹨-﹫ﹰ-ﹴﹶ-ﻼ！-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ￠-￦￨-￮￼�𐀀-𐀋𐀍-𐀦𐀨-𐀺𐀼𐀽𐀿-𐁍𐁐-𐁝𐂀-𐃺𐄀-𐄂𐄇-𐄳𐄷-𐆎𐆐-𐆛𐆠𐇐-𐇽𐊀-𐊜𐊠-𐋐𐋠-𐋻𐌀-𐌣𐌭-𐍊𐍐-𐍺𐎀-𐎝𐎟-𐏃𐏈-𐏕𐐀-𐒝𐒠-𐒩𐒰-𐓓𐓘-𐓻𐔀-𐔧𐔰-𐕣𐕯𐘀-𐜶𐝀-𐝕𐝠-𐝧𐠀-𐠅𐠈𐠊-𐠵𐠷𐠸𐠼𐠿-𐡕𐡗-𐢞𐢧-𐢯𐣠-𐣲𐣴𐣵𐣻-𐤛𐤟-𐤹𐤿𐦀-𐦷𐦼-𐧏𐧒-𐨃𐨅𐨆𐨌-𐨓𐨕-𐨗𐨙-𐨵𐨸-𐨿𐨺-𐩈𐩐-𐩘𐩠-𐪟𐫀-𐫦𐫫-𐫶𐬀-𐬵𐬹-𐭕𐭘-𐭲𐭸-𐮑𐮙-𐮜𐮩-𐮯𐰀-𐱈𐲀-𐲲𐳀-𐳲𐳺-𐴧𐴰-𐴹𐹠-𐹾𐼀-𐼧𐼰-𐽙𐿠-𐿶𑀀-𑁍𑁒-𑁯𑁿-𑂼𑂾-𑃁𑃐-𑃨𑃰-𑃹𑄀-𑄴𑄶-𑅆𑅐-𑅶𑆀-𑇍𑇐-𑇟𑇡-𑇴𑈀-𑈑𑈓-𑈾𑊀-𑊆𑊈𑊊-𑊍𑊏-𑊝𑊟-𑊩𑊰-𑋪𑋰-𑋹𑌀-𑌃𑌅-𑌌𑌏𑌐𑌓-𑌨𑌪-𑌰𑌲𑌳𑌵-𑌹𑌻-𑍄𑍇𑍈𑍋-𑍍𑍐𑍗𑍝-𑍣𑍦-𑍬𑍰-𑍴𑐀-𑑙𑑛𑑝-𑑟𑒀-𑓇𑓐-𑓙𑖀-𑖵𑖸-𑗝𑘀-𑙄𑙐-𑙙𑙠-𑙬𑚀-𑚸𑛀-𑛉𑜀-𑜚𑜝-𑜫𑜰-𑜿𑠀-𑠻𑢠-𑣲𑣿𑦠-𑦧𑦪-𑧗𑧚-𑧤𑨀-𑩇𑩐-𑪢𑫀-𑫸𑰀-𑰈𑰊-𑰶𑰸-𑱅𑱐-𑱬𑱰-𑲏𑲒-𑲧𑲩-𑲶𑴀-𑴆𑴈𑴉𑴋-𑴶𑴺𑴼𑴽𑴿-𑵇𑵐-𑵙𑵠-𑵥𑵧𑵨𑵪-𑶎𑶐𑶑𑶓-𑶘𑶠-𑶩𑻠-𑻸𑿀-𑿱𑿿-𒎙𒐀-𒑮𒑰-𒑴𒒀-𒕃𓀀-𓐮𔐀-𔙆𖠀-𖨸𖩀-𖩞𖩠-𖩩𖩮𖩯𖫐-𖫭𖫰-𖫵𖬀-𖭅𖭐-𖭙𖭛-𖭡𖭣-𖭷𖭽-𖮏𖹀-𖺚𖼀-𖽊𖽏-𖾇𖾏-𖾟𖿠-𖿣𗀀-𘟷𘠀-𘫲𛀀-𛄞𛅐-𛅒𛅤-𛅧𛅰-𛋻𛰀-𛱪𛱰-𛱼𛲀-𛲈𛲐-𛲙𛲜-𛲟𝀀-𝃵𝄀-𝄦𝄩-𝅲𝅻-𝇨𝈀-𝉅𝋠-𝋳𝌀-𝍖𝍠-𝍸𝐀-𝑔𝑖-𝒜𝒞𝒟𝒢𝒥𝒦𝒩-𝒬𝒮-𝒹𝒻𝒽-𝓃𝓅-𝔅𝔇-𝔊𝔍-𝔔𝔖-𝔜𝔞-𝔹𝔻-𝔾𝕀-𝕄𝕆𝕊-𝕐𝕒-𝚥𝚨-𝟋𝟎-𝪋𝪛-𝪟𝪡-𝪯𞀀-𞀆𞀈-𞀘𞀛-𞀡𞀣𞀤𞀦-𞀪𞄀-𞄬𞄰-𞄽𞅀-𞅉𞅎𞅏𞋀-𞋹𞋿𞠀-𞣄𞣇-𞣖𞤀-𞥋𞥐-𞥙𞥞𞥟𞱱-𞲴𞴁-𞴽𞸀-𞸃𞸅-𞸟𞸡𞸢𞸤𞸧𞸩-𞸲𞸴-𞸷𞸹𞸻𞹂𞹇𞹉𞹋𞹍-𞹏𞹑𞹒𞹔𞹗𞹙𞹛𞹝𞹟𞹡𞹢𞹤𞹧-𞹪𞹬-𞹲𞹴-𞹷𞹹-𞹼𞹾𞺀-𞺉𞺋-𞺛𞺡-𞺣𞺥-𞺩𞺫-𞺻𞻰𞻱🀀-🀫🀰-🂓🂠-🂮🂱-🂿🃁-🃏🃑-🃵🄀-🄌🄐-🅬🅰-🆬🇦-🈂🈐-🈻🉀-🉈🉐🉑🉠-🉥🌀-🛕🛠-🛬🛰-🛺🜀-🝳🞀-🟘🟠-🟫🠀-🠋🠐-🡇🡐-🡙🡠-🢇🢐-🢭🤀-🤋🤍-🥱🥳-🥶🥺-🦢🦥-🦪🦮-🧊🧍-🩓🩠-🩭🩰-🩳🩸-🩺🪀-🪂🪐-🪕𠀀-𪛖𪜀-𫜴𫝀-𫠝𫠠-𬺡𬺰-𮯠丽-𪘀󠄀-󠇯]/ui,
      "space",
    ],
    endLinebreak = lineCount > 1,
    completeKeys = "tab",
    invalidKeys,
    completion,
    endKeys = lineCount > 1
      ? new KeySpec({ key: "d", ctrl: true })
      : ["return", "enter", new KeySpec({ key: "d", ctrl: true })],
  }: {
    validKeys?: Keys;
    completeKeys?: Keys;
    invalidKeys?: Keys;
    endLinebreak?: boolean;
    endKeys?: Keys;
    completion?: ({}: { input: string; cursorX: number }) => { input: string };
  } = {},
) {
  var map: KeyMap = new Map();
  if (completion) map.set(completeKeys, completion);
  map.set(validKeys, ({ input, key, cursorX }) => {
    if (invalidKeys) {
      for (
        const invKey in invalidKeys instanceof Array
          ? invalidKeys
          : [invalidKeys]
      ) {
        if (KeySpec.of(invKey).is(key)) return {};
      }
    }
    input = input.substring(0, cursorX) + key.sequence +
      input.substring(cursorX);
    return { input: input, cursorX: cursorX + 1 };
  });
  if (lineCount > 1) {
    map.set("up", ({ cursorY }) => ({
      cursorY: cursorY - 1,
    }));
    map.set("down", ({ cursorY }) => ({
      cursorY: cursorY + 1,
    }));
    map.set(["return", "enter"], ({ cursorY, cursorX, lines }) => {
      if (lines.length == lineCount) {
        return {};
      }
      const input = lines[cursorY].substring(cursorX);
      lines[cursorY] = lines[cursorY].substring(0, cursorX);
      cursorY++;
      lines = [...lines.slice(0, cursorY), input, ...lines.slice(cursorY)];
      return {
        lines: lines,
        cursorY: cursorY,
        cursorX: 0,
      };
    });
  }
  map.set(
    endKeys,
    (
      { lines },
    ) => (endLinebreak
      ? { endinput: true, lines: [...lines, ""] }
      : { endinput: true }),
  );

  map.set("left", ({ cursorX }) => ({
    cursorX: cursorX - 1,
  }));
  map.set("right", ({ cursorX }) => ({
    cursorX: cursorX + 1,
  }));

  map.set("home", () => ({
    cursorX: 0,
  }));

  map.set("end", () => ({
    cursorX: Number.MAX_SAFE_INTEGER,
  }));

  map.set("backspace", ({ cursorY, input, cursorX, lines }) => {
    if (cursorX == 0) {
      return cursorY > 0
        ? {
          lines: [
            ...lines.slice(0, cursorY - 1),
            lines[cursorY - 1] + input,
            ...lines.slice(cursorY + 1),
          ],
          cursorY: cursorY - 1,
          cursorX: lines[cursorY - 1].length,
        }
        : {};
    }
    input = input.substring(0, cursorX - 1) + input.substring(cursorX);
    return { input: input, cursorX: cursorX - 1 };
  });

  map.set("delete", ({ input, cursorX, cursorY, lines }) => {
    if (cursorX == lines[cursorY].length) {
      return lines.length > cursorY + 1
        ? {
          lines: [
            ...lines.slice(0, cursorY),
            input + lines[cursorY + 1],
            ...lines.slice(cursorY + 2),
          ],
        }
        : {};
    }
    input = input.substring(0, cursorX) + input.substring(cursorX + 1);
    return { input: input };
  });

  return map;
}