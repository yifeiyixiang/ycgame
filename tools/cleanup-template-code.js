const fs = require("fs");
const path = require("path");

const root = process.cwd();

const tsIdentifierMap = new Map(Object.entries({
  pet: "PetStatusPlayControl",
  mainPet: "MainPetHomePlayControl",
  goodItem: "GoodItemDragPlayControl",
  gameData: "GameRuntimeDataPlayControl",
  EventManger: "EventBusPlayControl",
  LanauageManager: "LanguageConfigPlayControl",
  petConfig: "PetConfigPlayControl",
  itemConfig: "ItemConfigPlayControl",
  giftConfig: "GiftConfigPlayControl",
  checkConfig: "CheckConfigPlayControl",
  randItemData: "RandomItemPlayDataControl",
  chatItemData: "ChatItemPlayDataControl",
  rewardData: "RewardPlayDataControl",
  GamePlatform: "RewardPlatformPlayControl",
  RechargeManager: "RechargePlayControl",
  UtilScene: "SceneUtilityPlayControl",
  showRewardVideo: "showRewardVideoAd",
  initManager: "initializeRechargePlayControl",
  showVideo: "showRewardAdVideo",
  showStatusTip: "displayPetStatusTip",
  updateAnima: "refreshPetAnimation",
  saveDataClick: "persistClickPlayData",
  restartGame: "restartPlaySession",
}));

const localIdentifierMap = new Map(Object.entries({
  score: "queueScore",
  pickScore: "nearestQueueScore",
  st: "rewardPlayState",
}));

const keepCommentTokens = [
  "@ts-ignore",
  "@ts-expect-error",
  "eslint",
  "sourceMappingURL",
  "webpack",
];

function walk(dir, predicate, out = []) {
  if (!fs.existsSync(dir)) {
    return out;
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "library" || entry.name === "temp" || entry.name === "build") {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, predicate, out);
    } else if (predicate(full)) {
      out.push(full);
    }
  }
  return out;
}

function isIdentStart(ch) {
  return /[A-Za-z_$]/.test(ch);
}

function isIdentPart(ch) {
  return /[A-Za-z0-9_$]/.test(ch);
}

function transformSource(text, identifierMap, options = {}) {
  let out = "";
  let i = 0;
  let state = "normal";
  let quote = "";
  const stripComments = options.stripComments !== false;

  while (i < text.length) {
    const ch = text[i];
    const next = text[i + 1];

    if (state === "normal") {
      if (stripComments && ch === "/" && next === "/") {
        const end = text.indexOf("\n", i);
        const commentEnd = end === -1 ? text.length : end;
        const comment = text.slice(i, commentEnd);
        if (keepCommentTokens.some((token) => comment.includes(token))) {
          out += comment;
        }
        if (end !== -1) {
          out += "\n";
        }
        i = commentEnd + (end === -1 ? 0 : 1);
        continue;
      }

      if (stripComments && ch === "/" && next === "*") {
        const end = text.indexOf("*/", i + 2);
        i = end === -1 ? text.length : end + 2;
        continue;
      }

      if (ch === "'" || ch === '"' || ch === "`") {
        state = "string";
        quote = ch;
        out += ch;
        i++;
        continue;
      }

      if (isIdentStart(ch)) {
        let j = i + 1;
        while (j < text.length && isIdentPart(text[j])) {
          j++;
        }
        const ident = text.slice(i, j);
        out += identifierMap.get(ident) || ident;
        i = j;
        continue;
      }

      out += ch;
      i++;
      continue;
    }

    if (state === "string") {
      out += ch;
      if (ch === "\\") {
        if (i + 1 < text.length) {
          out += text[i + 1];
          i += 2;
        } else {
          i++;
        }
        continue;
      }
      if (ch === quote) {
        state = "normal";
      }
      i++;
    }
  }

  return out;
}

function transformTypeScript(text, filePath) {
  let next = transformSource(text, tsIdentifierMap);

  if (filePath.endsWith(path.join("guest_mgr.ts"))) {
    next = transformSource(next, localIdentifierMap, { stripComments: false });
  }

  next = next.replace(/\bwindow\.videoRewardCallBack\b/g, "(window as any).videoRewardCallBack");
  next = next.replace(/\bwindow\.videoFailCallBack\b/g, "(window as any).videoFailCallBack");
  return next.replace(/[ \t]+\r?\n/g, "\n").replace(/\n{4,}/g, "\n\n\n");
}

function transformPhp(text) {
  return transformSource(text, new Map()).replace(/[ \t]+\r?\n/g, "\n").replace(/\n{4,}/g, "\n\n\n");
}

function transformHtml(text) {
  return text
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<p[^>]*class=["']copyright["'][^>]*>[\s\S]*?<\/p>\s*/gi, "")
    .replace(/<strong>\s*Copyright[\s\S]*?All rights reserved\.\s*<\/strong>/gi, "")
    .replace(/<p>\s*Copyright[\s\S]*?<\/p>\s*/gi, "")
    .replace(/[ \t]+\r?\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n");
}

function updateFile(file, transform) {
  const before = fs.readFileSync(file, "utf8");
  const after = transform(before, file);
  if (after !== before) {
    fs.writeFileSync(file, after, "utf8");
    return true;
  }
  return false;
}

let changed = 0;

for (const file of [
  ...walk(path.join(root, "front", "assets", "typeScript"), (f) => /\.(ts|js)$/.test(f)),
  ...walk(path.join(root, "front", "assets", "Script"), (f) => /\.(ts|js)$/.test(f) && !f.endsWith(path.join("utils", "md5.js"))),
]) {
  if (updateFile(file, transformTypeScript)) {
    changed++;
  }
}

for (const file of walk(path.join(root, "backend", "admin", "application"), (f) => /\.(php)$/.test(f))) {
  if (updateFile(file, transformPhp)) {
    changed++;
  }
}

for (const file of [
  path.join(root, "backend", "admin", "public", "index.php"),
  path.join(root, "backend", "admin", "public", "router.php"),
  path.join(root, "backend", "admin", "public", "vZMXPImedo.php"),
]) {
  if (fs.existsSync(file) && updateFile(file, transformPhp)) {
    changed++;
  }
}

for (const file of walk(path.join(root, "backend", "admin", "application"), (f) => /\.html$/.test(f))) {
  if (updateFile(file, transformHtml)) {
    changed++;
  }
}

const langFile = path.join(root, "backend", "admin", "application", "index", "lang", "zh-cn.php");
if (fs.existsSync(langFile)) {
  if (updateFile(langFile, (text) => text
    .replace(/'Copyrights'\s*=>\s*'[^']*'/g, "'Copyrights'                                             => ''")
    .replace(/'The fastest framework based on ThinkPHP5 and Bootstrap'\s*=>\s*'[^']*'/g, "'The fastest framework based on ThinkPHP5 and Bootstrap' => ''"))) {
    changed++;
  }
}

console.log(`cleanup-template-code changed ${changed} files`);
