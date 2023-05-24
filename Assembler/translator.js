const { instructions, regs } = require("./constants");

function hexToBin(pHex) {
    let hex = pHex.slice(1);

    let res = parseInt(hex, 16).toString(2).padStart(8, 0);
    if (res.endsWith("NaN")) return undefined;
    return "0b" + res;
}
/**
 * @param {{opcode: string, type: string, section: string, operands: {HIGH: {value: string, isImmediate: boolean, isAddress: boolean, isRegister: boolean}, LOW: {value: string, isImmediate: boolean, isAddress: boolean, isRegister: boolean}}}} node
 */

exports.getInstructionByte = (node) => {
    let rv = null;

    if (node.operands?.HIGH?.isAddress || node.operands?.LOW?.isAddress) {
        rv = instructions.ramUnion[node.opcode].byteVal;
    } else if (node.operands?.HIGH?.isImmediate || node.operands?.LOW?.isImmediate) {
        rv = instructions.immediateUnion[node.opcode].byteVal;
    } else {
        rv = instructions.ramUnion[node.opcode].byteVal || instructions.immediateUnion[node.opcode].byteVal;
    }

    return Buffer.from(["0x"+rv], "hex");
}
/**
 * 
 * @param {{value: string, isImmediate: boolean, isAddress: boolean, isRegister: boolean}} operand 
 */
function trop(operand) {
    if (operand == undefined) {
        return "0b00000000";
    }
    if (operand.isAddress || operand.isImmediate) {
        return hexToBin(operand.value);
    }
    if (operand.isRegister) {
        return "0b"+regs[operand.value];
    }
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