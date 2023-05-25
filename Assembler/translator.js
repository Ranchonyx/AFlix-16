const { exit } = require("process");
const { instructions, regs } = require("./constants");

function hexToBin(pHex) {
    let hex = pHex.slice(1);

    let res = parseInt(hex, 16).toString(2).padStart(8, 0);
    if (res.endsWith("NaN")) return undefined;
    return "0b" + res;
}
/**
 * @param {{value: string, isImmediate: boolean, isAddress: boolean, isRegister: boolean, isFunctionCall: boolean}} operand 
 */

exports.getInstructionByte = (node) => {
    let rv = null;
    try {
        if (node.operands?.HIGH?.isAddress || node.operands?.LOW?.isAddress) {
            rv = instructions.ramUnion[node.opcode].byteVal;
        } else if (node.operands?.HIGH?.isImmediate || node.operands?.LOW?.isImmediate) {
            rv = instructions.immediateUnion[node.opcode].byteVal;
        } else {
            rv = instructions.ramUnion[node.opcode].byteVal || instructions.immediateUnion[node.opcode].byteVal;
        }    
    } catch(ex) {
        console.log(`Error processing node:`);
        console.log(node.opcode);
    }
    return Buffer.from(["0x" + rv], "hex");
}
/**
 * 
 * @param {{value: string, isImmediate: boolean, isAddress: boolean, isRegister: boolean, isFunctionCall: boolean}} operand 
 */
function trop(operand) {
    if (operand == undefined) {
        rv = "0b00000000";
    } else
    if (operand.isAddress || operand.isImmediate) {
        rv = hexToBin(operand.value);
    } else
    if (operand.isRegister) {
        rv = "0b" + regs[operand.value];
    } else {
        rv = "0b00000000";
    }

    console.log(operand?.value, rv);
    return rv;
}

/**
 * @param {{opcode: string, type: string, section: string, operands: {HIGH: {value: string, isImmediate: boolean, isAddress: boolean, isRegister: boolean}, LOW: {value: string, isImmediate: boolean, isAddress: boolean, isRegister: boolean}}}} node
 */
exports.translateAndOrderOperands = (node) => {
    switch (instructions.immediateUnion[node.opcode].significand) {
        case "BOTH":
            return Buffer.from([trop(node.operands?.HIGH), trop(node.operands?.LOW)], "binary");
        case "HIGH":
            return Buffer.from([trop(node.operands?.HIGH), "0b00000000"], "binary");
        case "LOW":
            return Buffer.from(["0b00000000", trop(node.operands?.LOW)], "binary");
        case "NONE":
            return Buffer.from(["0b00000000", "0b00000000"], "binary");
        default:
            throw new Error(`Unknown significand type for ${node.opcode} in ${node.section} (${instructions[node.opcode].significand})`);
    }
}