const pseudoTable = {
    "JSR": (params) => {
        return [
            "PHR IP",   //Push return address
            "DESP",     //Decrement sp
            "PLR RA",   //Save return address in RA
            "PHR A",    //Push Stack Frage
            "PHR B",
            "PHR C",
            "PHR D",
            `PHI ${params[0]}`,
            "PLR IP"    //And we're jumping on next clk cycle
        ]
    },
    "RET": (params) => {
        return [
            "PHR RA",
            "DESP",
            "PLR IP"
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