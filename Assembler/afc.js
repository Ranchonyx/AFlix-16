const { readFileSync, writeFileSync } = require("fs");
const { argv } = require("process");
const { analyzeSource, getCleanedSourceArray } = require("./sourceAnalyzer");
const { getInstructionByte, translateAndOrderOperands } = require("./translator");
const { createRomLayout } = require("./Program");
const { preprocess } = require("./Preprocessor")

const sourceText = readFileSync(argv[2], "utf-8");
const linkerFile = readFileSync(argv[3], "utf-8");

console.log(`Read ${Buffer.from(sourceText, "utf8").byteLength} bytes of source text.`);

const cleanedSourceArray = getCleanedSourceArray(sourceText);

const preprocessedArray = preprocess(cleanedSourceArray);

const analyzedNodes = analyzeSource(preprocessedArray);
console.log(`Generated ${analyzedNodes.length} analyzer nodes.`)

writeFileSync("./nodes.json", JSON.stringify(analyzedNodes, null, 2));

const translatedNodes = analyzedNodes
    .map(node => ({ ...node, assembly: Buffer.concat([getInstructionByte(node), translateAndOrderOperands(node)]) }));

console.log(`Parsed ${translatedNodes.length} analyzer nodes.`);
console.log(`Generating machine code...`);

const romImage = createRomLayout(linkerFile, translatedNodes);
console.log(`Rom layout created, 0x${romImage.byteLength.toString(16)} bytes in size.`);
console.log(`3 bytes / word`);
console.log(`NOP-Padded to 0x${romImage.byteLength / 3} words.`);

writeFileSync("./a.out", romImage, "binary");
console.log(`Wrote \"a.out\" with AFlix-16 machine code.`);