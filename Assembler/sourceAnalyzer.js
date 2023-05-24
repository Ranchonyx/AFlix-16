const { regs, instructions } = require("./constants");

function* sequence() {
    let idx = 0;
    while (idx > -1) {
        yield idx++;
    }
}

const id = sequence();

function generateAnalyzerNode(sectionName, instr, paramCount) {
    function getType(paramCount) {
        return paramCount === 1 ? "UNARY" : paramCount === 2 ? "BINARY" : paramCount === 3 ? "TERNARY" : "NONE";
    }

    function isRegister(operand) {
        return Object.keys(regs).includes(operand);
    }

    function isImmediate(operand) {
        return operand.startsWith("$");
    }

    function isRamAddress(operand) {
        return operand.startsWith("#");
    }

    function makeOperandNode(operand) {
        return {
            value: operand,
            isImmediate: isImmediate(operand),
            isAddress: isRamAddress(operand),
            isRegister: isRegister(operand),
        };
    }

    let [op, a, b] = instr;

    if (!op in Object.keys(instructions)) {
        throw new Error(`Invalid instruction encountered in section ${sectionName} (${instr.join(" ")})`)
    }

    let node = {
        opcode: op,
        type: getType(paramCount),
        section: sectionName,
        id: id.next().value
    };

    switch (node.type) {
        case "UNARY":
            if (a.length === 5 || a.length === 6) {
                let v = a.slice(-4);
                if (isRamAddress(a)) {
                    node.operands = {
                        HIGH: makeOperandNode("#" + v.slice(0, 2)),
                        LOW: makeOperandNode("#" + v.slice(2, 4))
                    }
                } else {
                    node.operands = {
                        HIGH: makeOperandNode("$" + v.slice(0, 2)),
                        LOW: makeOperandNode("$" + v.slice(2, 4))
                    }
                }
            } else if (isRegister(a)) {
                node.operands = {
                    HIGH: makeOperandNode(a),
                    LOW: makeOperandNode(a)
                }
            } else {
                node.operands = {
                    HIGH: makeOperandNode(a),
                    LOW: makeOperandNode(a)
                }
            }
            break;
        case "BINARY":
            node.operands = {
                HIGH: makeOperandNode(a),
                LOW: makeOperandNode(b)
            }
            break;
        case "TERNARY":
            node.operands = {
                HIGH: makeOperandNode(a),
                LOW: makeOperandNode(b),
            }
            break;
        case "NONE":
            break;
        default:
            throw new Error(`Unknown node type of ${node.type}!`);
    }

    return node;
}

function getRawSections(arr) {
    let sections = [];
    let currentSection = {
        start: null,
        stop: null,
        name: null,
        content: []
    };

    for (let i = 0; i < arr.length; i++) {
        let statement = arr[i];
        if (statement.startsWith(".section") && statement.endsWith(":")) {
            currentSection.name = statement.split(" ")[1].substr(0, statement.split(" ")[1].lastIndexOf(":"));
            currentSection.start = i + 1;
        }
        if (statement.startsWith(".endsection")) {
            currentSection.stop = i;
            currentSection.content = arr.slice(currentSection.start, currentSection.stop).filter(e => e !== "");
            sections.push(currentSection);
            currentSection = {
                start: null,
                stop: null,
                name: null,
                content: []
            };
        }
    }
    return sections;
}

function stripComments(input) {
    return input.map(line => {
        let i1 = line.indexOf(";");
        let i2 = line.lastIndexOf(";");
        if ((i1 !== -1 && i2 !== -1) && i1 === i2) {
            return line.slice(0, i2).trim()
        } else {
            return line;
        }
    }).filter(line => line !== "");
}

exports.getCleanedSourceArray = (sourceText) => {
    const sourceArray = sourceText.split("\r\n")
    .map(line => line.trim());
    
    return stripComments(sourceArray);
}

exports.analyzeSource = (cleanedSourceArray) => {
    const rawSections = getRawSections(cleanedSourceArray);
    const analyzedNodes = [];

    for (let section of rawSections) {
        for (let mnemonic of section.content) {
            let instr = mnemonic.split(" ");
            analyzedNodes.push(generateAnalyzerNode(section.name, instr, instr.length - 1));
        }
    }
    return analyzedNodes;
}