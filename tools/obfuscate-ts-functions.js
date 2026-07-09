#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const IDENTIFIER_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const DEFAULT_PREFIX = "_fn_";

const DEFAULT_EXCLUDED_DIRS = new Set([
  ".git",
  ".vs",
  "build",
  "dist",
  "library",
  "node_modules",
  "temp",
  "third_party_unused",
]);

const ASSET_EXTENSIONS = new Set([
  ".anim",
  ".animation",
  ".fire",
  ".json",
  ".prefab",
  ".scene",
]);

const COCOS_RESERVED_NAMES = new Set([
  "constructor",
  "__preload",
  "onLoad",
  "start",
  "update",
  "lateUpdate",
  "onEnable",
  "onDisable",
  "onDestroy",
  "onFocusInEditor",
  "onLostFocusInEditor",
  "onRestore",
  "onBeforeSerialize",
  "onAfterDeserialize",
  "resetInEditor",
  "onBeginContact",
  "onEndContact",
  "onPreSolve",
  "onPostSolve",
  "onCollisionEnter",
  "onCollisionStay",
  "onCollisionExit",
  "onTriggerEnter",
  "onTriggerStay",
  "onTriggerExit",
]);

function printHelp() {
  console.log(`Usage:
  node tools/obfuscate-ts-functions.js --root front --dry-run
  node tools/obfuscate-ts-functions.js --root front --apply --map front/function-obfuscation-map.json

Options:
  --root <dir>                 Front project root. Defaults to ./front if it exists.
  --dry-run                    Analyze and print the rename plan without writing files. Default.
  --apply                      Rewrite TypeScript files.
  --map <file>                 Write a JSON report/map to this file.
  --prefix <prefix>            Obfuscated function prefix. Default: ${DEFAULT_PREFIX}
  --reserve <a,b,c>            Extra function names to keep unchanged.
  --allow-string-referenced    Rename functions whose names appear in TS string literals.
  --allow-ambiguous-property   Rename even if a same-name property access cannot be resolved.
  --verbose                    Print more skipped examples.
  --help                       Show this help.
`);
}

function parseArgs(argv) {
  const options = {
    root: null,
    apply: false,
    dryRun: true,
    mapFile: null,
    prefix: DEFAULT_PREFIX,
    extraReserved: new Set(),
    allowStringReferenced: false,
    allowAmbiguousProperty: false,
    verbose: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const readValue = () => {
      if (arg.includes("=")) {
        return arg.slice(arg.indexOf("=") + 1);
      }
      i++;
      if (i >= argv.length) {
        throw new Error(`Missing value for ${arg}`);
      }
      return argv[i];
    };

    if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else if (arg === "--root" || arg.startsWith("--root=")) {
      options.root = readValue();
    } else if (arg === "--map" || arg.startsWith("--map=")) {
      options.mapFile = readValue();
    } else if (arg === "--prefix" || arg.startsWith("--prefix=")) {
      options.prefix = readValue();
    } else if (arg === "--reserve" || arg.startsWith("--reserve=")) {
      for (const name of readValue().split(",")) {
        const trimmed = name.trim();
        if (trimmed) {
          options.extraReserved.add(trimmed);
        }
      }
    } else if (arg === "--apply") {
      options.apply = true;
      options.dryRun = false;
    } else if (arg === "--dry-run") {
      options.apply = false;
      options.dryRun = true;
    } else if (arg === "--allow-string-referenced") {
      options.allowStringReferenced = true;
    } else if (arg === "--allow-ambiguous-property") {
      options.allowAmbiguousProperty = true;
    } else if (arg === "--verbose") {
      options.verbose = true;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  if (!IDENTIFIER_RE.test(options.prefix + "a")) {
    throw new Error(`Invalid prefix: ${options.prefix}`);
  }

  return options;
}

function resolveProjectRoot(rootArg) {
  if (rootArg) {
    return path.resolve(rootArg);
  }

  const cwd = process.cwd();
  const frontFromCwd = path.join(cwd, "front");
  if (fs.existsSync(path.join(frontFromCwd, "assets"))) {
    return frontFromCwd;
  }
  return cwd;
}

function requireTypeScript(projectRoot) {
  const candidates = [
    path.join(projectRoot, "node_modules", "typescript", "lib", "typescript.js"),
    path.join(path.dirname(projectRoot), "node_modules", "typescript", "lib", "typescript.js"),
    "typescript",
  ];

  const errors = [];
  for (const candidate of candidates) {
    try {
      return require(candidate);
    } catch (error) {
      errors.push(`${candidate}: ${error.message}`);
    }
  }

  const relativeRoot = path.relative(process.cwd(), projectRoot) || ".";
  throw new Error(
    [
      "TypeScript compiler API is required but was not found.",
      `Install it first, for example: cd ${relativeRoot} && npm install`,
      "Tried:",
      ...errors.map((line) => `  - ${line}`),
    ].join("\n")
  );
}

function walkFiles(dir, predicate, out = []) {
  if (!fs.existsSync(dir)) {
    return out;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!DEFAULT_EXCLUDED_DIRS.has(entry.name)) {
        walkFiles(path.join(dir, entry.name), predicate, out);
      }
      continue;
    }

    const full = path.join(dir, entry.name);
    if (predicate(full)) {
      out.push(full);
    }
  }

  return out;
}

function normalizeFile(file) {
  return file.split(path.sep).join("/");
}

function getLineAndColumn(sourceFile, pos) {
  const lineChar = sourceFile.getLineAndCharacterOfPosition(pos);
  return {
    line: lineChar.line + 1,
    column: lineChar.character + 1,
  };
}

function addCount(map, key, amount = 1) {
  map.set(key, (map.get(key) || 0) + amount);
}

function addExample(map, key, example, max = 12) {
  if (!map.has(key)) {
    map.set(key, []);
  }
  const list = map.get(key);
  if (list.length < max) {
    list.push(example);
  }
}

function getDecorators(ts, node) {
  if (typeof ts.canHaveDecorators === "function" && typeof ts.getDecorators === "function") {
    return ts.canHaveDecorators(node) ? Array.from(ts.getDecorators(node) || []) : [];
  }
  return node.decorators ? Array.from(node.decorators) : [];
}

function hasDecorators(ts, node) {
  return getDecorators(ts, node).length > 0;
}

function isFunctionInitializer(ts, node) {
  return Boolean(
    node &&
      (ts.isArrowFunction(node) ||
        ts.isFunctionExpression(node) ||
        ts.isFunctionDeclaration(node))
  );
}

function isClassLike(ts, node) {
  return Boolean(node && (ts.isClassDeclaration(node) || ts.isClassExpression(node)));
}

function isObjectLiteralMethodName(ts, nameNode) {
  const parent = nameNode.parent;
  return Boolean(
    parent &&
      ts.isMethodDeclaration(parent) &&
      parent.name === nameNode &&
      parent.parent &&
      ts.isObjectLiteralExpression(parent.parent)
  );
}

function isObjectLiteralPropertyKey(ts, nameNode) {
  const parent = nameNode.parent;
  return Boolean(
    parent &&
      ((ts.isPropertyAssignment(parent) && parent.name === nameNode) ||
        isObjectLiteralMethodName(ts, nameNode))
  );
}

function isDeclarationName(ts, node) {
  const parent = node.parent;
  return Boolean(
    parent &&
      ((parent.name === node &&
        (ts.isFunctionDeclaration(parent) ||
          ts.isMethodDeclaration(parent) ||
          ts.isVariableDeclaration(parent) ||
          ts.isPropertyDeclaration(parent) ||
          ts.isFunctionExpression(parent))) ||
        (ts.isImportSpecifier(parent) && parent.name === node) ||
        (ts.isExportSpecifier(parent) && parent.name === node))
  );
}

function collectAssetHandlerNames(projectRoot) {
  const names = new Set();
  const assetRoot = path.join(projectRoot, "assets");
  const root = fs.existsSync(assetRoot) ? assetRoot : projectRoot;
  const files = walkFiles(root, (file) => ASSET_EXTENSIONS.has(path.extname(file).toLowerCase()));
  const handlerRe = /"(?:handler|_handler|function|_function|func|_func)"\s*:\s*"([A-Za-z_$][A-Za-z0-9_$]*)"/g;

  for (const file of files) {
    let text;
    try {
      text = fs.readFileSync(file, "utf8");
    } catch (_) {
      continue;
    }

    let match;
    while ((match = handlerRe.exec(text)) !== null) {
      names.add(match[1]);
    }
  }

  return { names, filesScanned: files.length };
}

function baseNameForIndex(index) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  let n = index;
  let out = "";
  do {
    out = alphabet[n % alphabet.length] + out;
    n = Math.floor(n / alphabet.length) - 1;
  } while (n >= 0);
  return out;
}

function createProgram(ts, tsFiles) {
  return ts.createProgram(tsFiles, {
    allowJs: false,
    checkJs: false,
    experimentalDecorators: true,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    noEmit: true,
    skipLibCheck: true,
    strict: false,
    target: ts.ScriptTarget.ES2020,
  });
}

function createAnalyzer(ts, projectRoot, options) {
  const tsFiles = walkFiles(
    projectRoot,
    (file) => file.endsWith(".ts") && !file.endsWith(".d.ts")
  ).sort((a, b) => a.localeCompare(b));

  const program = createProgram(ts, tsFiles);
  const checker = program.getTypeChecker();
  const sourceFiles = tsFiles
    .map((file) => program.getSourceFile(file))
    .filter(Boolean);

  const assetScan = collectAssetHandlerNames(projectRoot);
  const reservedNames = new Set([
    ...COCOS_RESERVED_NAMES,
    ...assetScan.names,
    ...options.extraReserved,
  ]);
  const allIdentifiers = new Set(reservedNames);
  const stringLiteralNames = new Set();
  const skipCounts = new Map();
  const skipExamples = new Map();
  const records = [];
  const symbolKeyToRecord = new Map();

  function canonicalSymbol(symbol) {
    if (!symbol) {
      return null;
    }
    if ((symbol.flags & ts.SymbolFlags.Alias) && typeof checker.getAliasedSymbol === "function") {
      try {
        return checker.getAliasedSymbol(symbol);
      } catch (_) {
        return symbol;
      }
    }
    return symbol;
  }

  function keyForSymbol(symbol) {
    const canonical = canonicalSymbol(symbol);
    if (!canonical) {
      return null;
    }

    const declarations = canonical.declarations || [];
    if (declarations.length > 0) {
      return declarations
        .map((declaration) => {
          const sourceFile = declaration.getSourceFile();
          return `${sourceFile.fileName}:${declaration.pos}:${declaration.end}`;
        })
        .sort()
        .join("|");
    }

    return `${String(canonical.escapedName || canonical.name)}:${canonical.flags}`;
  }

  function skip(reason, name, sourceFile, node) {
    addCount(skipCounts, reason);
    if (sourceFile && node) {
      const loc = getLineAndColumn(sourceFile, node.getStart(sourceFile));
      addExample(skipExamples, reason, {
        name,
        file: normalizeFile(path.relative(projectRoot, sourceFile.fileName)),
        line: loc.line,
      });
    }
  }

  function collectNames(sourceFile) {
    function visit(node) {
      if (ts.isIdentifier(node)) {
        allIdentifiers.add(node.text);
      } else if (
        (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) &&
        IDENTIFIER_RE.test(node.text)
      ) {
        stringLiteralNames.add(node.text);
      }
      ts.forEachChild(node, visit);
    }
    visit(sourceFile);
  }

  for (const sourceFile of sourceFiles) {
    collectNames(sourceFile);
  }

  function addCandidate(nameNode, declaration, kind, sourceFile) {
    const name = nameNode.text;
    if (name.startsWith(options.prefix)) {
      skip("already-obfuscated", name, sourceFile, nameNode);
      return;
    }
    if (reservedNames.has(name)) {
      skip("reserved", name, sourceFile, nameNode);
      return;
    }
    if (!options.allowStringReferenced && stringLiteralNames.has(name)) {
      skip("string-referenced", name, sourceFile, nameNode);
      return;
    }
    if (hasDecorators(ts, declaration)) {
      skip("decorated-declaration", name, sourceFile, nameNode);
      return;
    }

    const symbol = canonicalSymbol(checker.getSymbolAtLocation(nameNode));
    const symbolKey = keyForSymbol(symbol);
    if (!symbol || !symbolKey) {
      skip("no-symbol", name, sourceFile, nameNode);
      return;
    }

    let record = symbolKeyToRecord.get(symbolKey);
    if (!record) {
      record = {
        symbol,
        symbolKey,
        originalName: name,
        kind,
        declarations: [],
      };
      symbolKeyToRecord.set(symbolKey, record);
      records.push(record);
    }

    const loc = getLineAndColumn(sourceFile, nameNode.getStart(sourceFile));
    record.declarations.push({
      file: normalizeFile(path.relative(projectRoot, sourceFile.fileName)),
      line: loc.line,
      column: loc.column,
      kind,
    });
  }

  function collectCandidates(sourceFile) {
    function visit(node) {
      if (ts.isFunctionDeclaration(node) && node.name && ts.isIdentifier(node.name)) {
        addCandidate(node.name, node, "function", sourceFile);
      } else if (
        ts.isFunctionExpression(node) &&
        node.name &&
        ts.isIdentifier(node.name)
      ) {
        addCandidate(node.name, node, "function-expression", sourceFile);
      } else if (
        ts.isMethodDeclaration(node) &&
        node.name &&
        ts.isIdentifier(node.name)
      ) {
        if (isClassLike(ts, node.parent)) {
          addCandidate(node.name, node, "class-method", sourceFile);
        } else {
          skip("object-literal-method", node.name.text, sourceFile, node.name);
        }
      } else if (
        ts.isVariableDeclaration(node) &&
        node.name &&
        ts.isIdentifier(node.name) &&
        isFunctionInitializer(ts, node.initializer)
      ) {
        addCandidate(node.name, node, "function-variable", sourceFile);
      } else if (
        ts.isPropertyDeclaration(node) &&
        node.name &&
        ts.isIdentifier(node.name) &&
        isFunctionInitializer(ts, node.initializer)
      ) {
        addCandidate(node.name, node, "function-property", sourceFile);
      }

      ts.forEachChild(node, visit);
    }
    visit(sourceFile);
  }

  for (const sourceFile of sourceFiles) {
    collectCandidates(sourceFile);
  }

  const candidateNames = new Set(records.map((record) => record.originalName));
  const ambiguousNames = new Map();

  function markAmbiguous(name, sourceFile, node, reason) {
    if (!ambiguousNames.has(name)) {
      ambiguousNames.set(name, {
        count: 0,
        examples: [],
      });
    }
    const entry = ambiguousNames.get(name);
    entry.count++;
    if (entry.examples.length < 12) {
      const loc = getLineAndColumn(sourceFile, node.getStart(sourceFile));
      entry.examples.push({
        reason,
        file: normalizeFile(path.relative(projectRoot, sourceFile.fileName)),
        line: loc.line,
      });
    }
  }

  function isCandidateSymbol(node) {
    const symbolKey = keyForSymbol(checker.getSymbolAtLocation(node));
    return Boolean(symbolKey && symbolKeyToRecord.has(symbolKey));
  }

  function scanAmbiguousReferences(sourceFile) {
    function visit(node) {
      if (ts.isIdentifier(node) && candidateNames.has(node.text)) {
        const parent = node.parent;
        if (ts.isShorthandPropertyAssignment(parent) && parent.name === node) {
          markAmbiguous(node.text, sourceFile, node, "object-shorthand");
        } else if (isObjectLiteralPropertyKey(ts, node)) {
          // A property key is not a function reference.
        } else if (ts.isPropertyAccessExpression(parent) && parent.name === node) {
          if (!isCandidateSymbol(node)) {
            markAmbiguous(node.text, sourceFile, node, "unresolved-or-external-property");
          }
        } else if (!isDeclarationName(ts, node) && !isCandidateSymbol(node)) {
          markAmbiguous(node.text, sourceFile, node, "unresolved-identifier");
        }
      } else if (
        ts.isElementAccessExpression(node) &&
        (ts.isStringLiteral(node.argumentExpression) ||
          ts.isNoSubstitutionTemplateLiteral(node.argumentExpression)) &&
        candidateNames.has(node.argumentExpression.text)
      ) {
        markAmbiguous(
          node.argumentExpression.text,
          sourceFile,
          node.argumentExpression,
          "element-access-string"
        );
      }
      ts.forEachChild(node, visit);
    }
    visit(sourceFile);
  }

  for (const sourceFile of sourceFiles) {
    scanAmbiguousReferences(sourceFile);
  }

  let activeRecords = records;
  if (!options.allowAmbiguousProperty) {
    activeRecords = activeRecords.filter((record) => {
      if (ambiguousNames.has(record.originalName)) {
        skip("ambiguous-property-use", record.originalName, null, null);
        return false;
      }
      return true;
    });
  }

  const renameGroups = Array.from(
    new Set(activeRecords.map((record) => record.originalName))
  ).sort((a, b) => a.localeCompare(b));
  const namePlan = new Map();
  let nextIndex = 0;

  for (const originalName of renameGroups) {
    let newName;
    do {
      newName = `${options.prefix}${baseNameForIndex(nextIndex)}`;
      nextIndex++;
    } while (allIdentifiers.has(newName) || namePlan.has(newName));

    namePlan.set(originalName, newName);
    allIdentifiers.add(newName);
  }

  const activeSymbolKeyToNewName = new Map();
  for (const record of activeRecords) {
    activeSymbolKeyToNewName.set(record.symbolKey, namePlan.get(record.originalName));
  }

  function newNameForIdentifier(node) {
    if (isObjectLiteralPropertyKey(ts, node)) {
      return null;
    }
    const symbolKey = keyForSymbol(checker.getSymbolAtLocation(node));
    if (!symbolKey) {
      return null;
    }
    return activeSymbolKeyToNewName.get(symbolKey) || null;
  }

  const replacementsByFile = new Map();
  const replacementKeys = new Set();

  function addReplacement(sourceFile, node, newName) {
    const start = node.getStart(sourceFile);
    const end = node.getEnd();
    const key = `${sourceFile.fileName}:${start}:${end}`;
    if (replacementKeys.has(key)) {
      return;
    }
    replacementKeys.add(key);

    if (!replacementsByFile.has(sourceFile.fileName)) {
      replacementsByFile.set(sourceFile.fileName, []);
    }
    replacementsByFile.get(sourceFile.fileName).push({
      start,
      end,
      text: newName,
      oldText: node.text,
    });
  }

  function collectReplacements(sourceFile) {
    function visit(node) {
      if (ts.isIdentifier(node)) {
        const nextName = newNameForIdentifier(node);
        if (nextName && nextName !== node.text) {
          addReplacement(sourceFile, node, nextName);
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(sourceFile);
  }

  for (const sourceFile of sourceFiles) {
    collectReplacements(sourceFile);
  }

  for (const replacements of replacementsByFile.values()) {
    replacements.sort((a, b) => b.start - a.start);
  }

  const replacementTotal = Array.from(replacementsByFile.values()).reduce(
    (sum, list) => sum + list.length,
    0
  );

  function buildReport() {
    const activeRecordSet = new Set(activeRecords);
    const declarations = activeRecords
      .flatMap((record) =>
        record.declarations.map((decl) => ({
          originalName: record.originalName,
          newName: namePlan.get(record.originalName),
          kind: decl.kind,
          file: decl.file,
          line: decl.line,
          column: decl.column,
        }))
      )
      .sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);

    const skippedDeclarations = records
      .filter((record) => !activeRecordSet.has(record))
      .flatMap((record) =>
        record.declarations.map((decl) => ({
          name: record.originalName,
          file: decl.file,
          line: decl.line,
          kind: decl.kind,
          ambiguous: ambiguousNames.get(record.originalName) || null,
        }))
      )
      .sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);

    return {
      mode: options.apply ? "apply" : "dry-run",
      root: projectRoot,
      tsFiles: tsFiles.length,
      assetFilesScanned: assetScan.filesScanned,
      assetHandlersReserved: Array.from(assetScan.names).sort(),
      renameGroups: Array.from(namePlan.entries()).map(([originalName, newName]) => ({
        originalName,
        newName,
      })),
      renamedDeclarationCount: declarations.length,
      renamedSymbolCount: activeRecords.length,
      replacements: {
        total: replacementTotal,
        files: Array.from(replacementsByFile.entries())
          .map(([file, list]) => ({
            file: normalizeFile(path.relative(projectRoot, file)),
            count: list.length,
          }))
          .sort((a, b) => b.count - a.count || a.file.localeCompare(b.file)),
      },
      skipped: {
        counts: Object.fromEntries(Array.from(skipCounts.entries()).sort()),
        examples: Object.fromEntries(Array.from(skipExamples.entries()).sort()),
        ambiguousNames: Object.fromEntries(
          Array.from(ambiguousNames.entries()).sort((a, b) => a[0].localeCompare(b[0]))
        ),
        skippedDeclarations: options.verbose
          ? skippedDeclarations
          : skippedDeclarations.slice(0, 80),
      },
    };
  }

  function applyReplacements() {
    let changedFiles = 0;
    for (const [file, replacements] of replacementsByFile.entries()) {
      let text = fs.readFileSync(file, "utf8");
      const original = text;
      for (const replacement of replacements) {
        text =
          text.slice(0, replacement.start) +
          replacement.text +
          text.slice(replacement.end);
      }
      if (text !== original) {
        fs.writeFileSync(file, text, "utf8");
        changedFiles++;
      }
    }
    return changedFiles;
  }

  return {
    buildReport,
    applyReplacements,
  };
}

function printSummary(report, options) {
  console.log(`Mode: ${report.mode}`);
  console.log(`Root: ${report.root}`);
  console.log(`TS files scanned: ${report.tsFiles}`);
  console.log(`Asset files scanned: ${report.assetFilesScanned}`);
  console.log(`Asset handler names reserved: ${report.assetHandlersReserved.length}`);
  console.log(`Rename groups: ${report.renameGroups.length}`);
  console.log(`Rename symbols: ${report.renamedSymbolCount}`);
  console.log(`Rename declarations: ${report.renamedDeclarationCount}`);
  console.log(`Replacement edits: ${report.replacements.total}`);
  console.log(`Files with edits: ${report.replacements.files.length}`);

  const skipped = report.skipped.counts;
  const skippedText = Object.keys(skipped)
    .sort()
    .map((key) => `${key}=${skipped[key]}`)
    .join(", ");
  console.log(`Skipped: ${skippedText || "none"}`);

  if (report.renameGroups.length > 0) {
    console.log("\nFirst rename groups:");
    for (const item of report.renameGroups.slice(0, 30)) {
      console.log(`  ${item.originalName} -> ${item.newName}`);
    }
    if (report.renameGroups.length > 30) {
      console.log(`  ... ${report.renameGroups.length - 30} more`);
    }
  }

  if (Object.keys(report.skipped.ambiguousNames).length > 0) {
    console.log("\nAmbiguous names kept unchanged:");
    for (const [name, info] of Object.entries(report.skipped.ambiguousNames).slice(0, 20)) {
      const first = info.examples[0];
      const where = first ? `${first.file}:${first.line} ${first.reason}` : "no example";
      console.log(`  ${name}: ${info.count} use(s), first ${where}`);
    }
    if (!options.allowAmbiguousProperty) {
      console.log("  Use --allow-ambiguous-property only after manually checking these names.");
    }
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  const projectRoot = resolveProjectRoot(options.root);
  if (!fs.existsSync(projectRoot)) {
    throw new Error(`Root does not exist: ${projectRoot}`);
  }

  const ts = requireTypeScript(projectRoot);
  const analyzer = createAnalyzer(ts, projectRoot, options);
  const report = analyzer.buildReport();

  if (options.apply) {
    const changedFiles = analyzer.applyReplacements();
    report.changedFiles = changedFiles;
  }

  if (options.mapFile) {
    const mapFile = path.resolve(options.mapFile);
    fs.mkdirSync(path.dirname(mapFile), { recursive: true });
    fs.writeFileSync(mapFile, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  }

  printSummary(report, options);

  if (!options.apply) {
    console.log("\nDry-run only. Re-run with --apply to rewrite files.");
  } else {
    console.log(`\nApplied. Changed files: ${report.changedFiles}`);
  }
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
