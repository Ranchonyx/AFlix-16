const pseudoTable = {
    "JSR": (params) => {
        return [
            "PUSH A", //Push A on stack
            "NOP",
            "PUSH IP",   //Push IP on stack
            "NOP",
            "LAX $000e", //Load $e into A
            "SAX #$0000", //Store A into #$0000
            "POP A", // Pop IP into A
            "DESP",
            "ADD #$0000", //Add #$0000 to A
            "PUSH A",
            "NOP",
            "POP RA",
            "DESP",
            "POP A",
            "DESP",
            `JMP ${params[0]}`,
        ];
    },
    "RET": (params) => {
        return [
            "JRA",
        ];
    }
}

function validatePseudoinstruction(mnemonic) {
    return mnemonic.split(" ")[0] in pseudoTable;
}

exports.preprocess = function (cleanedSourceArray) {
    return resolvePseudoinstructions(cleanedSourceArray).flat();
}

function handlePseudoinstruction(idx, params) {
    console.log(`Resolve pseudoinstruction ${idx}(${params})`);
    return pseudoTable[idx](params);
}

function resolvePseudoinstructions(clstr) {
    let cleanedSourceTextArray = clstr;
    for (let [index, instr] of cleanedSourceTextArray.entries()) {
        let pseudoTableIndex = instr.split(" ")[0];
        if (validatePseudoinstruction(pseudoTableIndex)) {
            cleanedSourceTextArray[index] = handlePseudoinstruction(pseudoTableIndex, instr.split(" ").slice(1));
        } else {
            continue;
        }
    }

    return cleanedSourceTextArray;
}