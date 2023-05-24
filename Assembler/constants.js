const ldImmTab = {
    "LAX": { byteVal: "00", significand: "BOTH" },
    "LAH": { byteVal: "01", significand: "HIGH" },
    "LAL": { byteVal: "02", significand: "LOW" },
    "LBX": { byteVal: "03", significand: "BOTH" },
    "LBH": { byteVal: "04", significand: "HIGH" },
    "LBL": { byteVal: "05", significand: "LOW" },
    "LCX": { byteVal: "06", significand: "BOTH" },
    "LCH": { byteVal: "07", significand: "HIGH" },
    "LCL": { byteVal: "08", significand: "LOW" },
    "LDX": { byteVal: "09", significand: "BOTH" },
    "LDH": { byteVal: "0a", significand: "HIGH" },
    "LDL": { byteVal: "0b", significand: "LOW" },
    "LRAX": { byteVal: "0c", significand: "BOTH" },
    "LRAH": { byteVal: "0d", significand: "HIGH" },
    "LRAL": { byteVal: "0e", significand: "LOW" },
}

const ldRamTab = {
    "LAX": { byteVal: "20", significand: "BOTH" },
    "LAH": { byteVal: "21", significand: "HIGH" },
    "LAL": { byteVal: "22", significand: "LOW" },
    "LBX": { byteVal: "23", significand: "BOTH" },
    "LBH": { byteVal: "24", significand: "HIGH" },
    "LBL": { byteVal: "25", significand: "LOW" },
    "LCX": { byteVal: "26", significand: "BOTH" },
    "LCH": { byteVal: "27", significand: "HIGH" },
    "LCL": { byteVal: "28", significand: "LOW" },
    "LDX": { byteVal: "29", significand: "BOTH" },
    "LDH": { byteVal: "2a", significand: "HIGH" },
    "LDL": { byteVal: "2b", significand: "LOW" },
    "LRAX": { byteVal: "2c", significand: "BOTH" },
    "LRAH": { byteVal: "2d", significand: "HIGH" },
    "LRAL": { byteVal: "2e", significand: "LOW" },
}

const stRegTab = {
    "SAX": { byteVal: "40", significand: "BOTH" },
    "SAH": { byteVal: "41", significand: "HIGH" },
    "SAL": { byteVal: "42", significand: "LOW" },
    "SBX": { byteVal: "43", significand: "BOTH" },
    "SBH": { byteVal: "44", significand: "HIGH" },
    "SBL": { byteVal: "45", significand: "LOW" },
    "SCX": { byteVal: "46", significand: "BOTH" },
    "SCH": { byteVal: "47", significand: "HIGH" },
    "SCL": { byteVal: "48", significand: "LOW" },
    "SDX": { byteVal: "49", significand: "BOTH" },
    "SDH": { byteVal: "4a", significand: "HIGH" },
    "SDL": { byteVal: "4b", significand: "LOW" },
    "SRAX": { byteVal: "4c", significand: "BOTH" },
    "SRAH": { byteVal: "4d", significand: "HIGH" },
    "SRAL": { byteVal: "4e", significand: "LOW" },
}

const aluOpTab = {
    "ADD": { byteVal: "60", significand: "BOTH" },
    "SUB": { byteVal: "61", significand: "BOTH" },
    "AND": { byteVal: "62", significand: "BOTH" },
    "OR": { byteVal: "63", significand: "BOTH" },
    "NOT": { byteVal: "64", significand: "NONE" },
    "NOR": { byteVal: "65", significand: "BOTH" },
    "NAND": { byteVal: "66", significand: "BOTH" },
    "XOR": { byteVal: "67", significand: "BOTH" },
    "INCA": { byteVal: "68", significand: "NONE" },
    "DECA": { byteVal: "69", significand: "NONE" },
}

const skOpTab = {
    "SRST": { byteVal: "80", significand: "NONE" },
    "PHI": { byteVal: "81", significand: "BOTH" },
    "PHR": { byteVal: "82", significand: "LOW" },
    "PLR": { byteVal: "83", significand: "LOW" },
    "RFI": { byteVal: "84", significand: "NONE" }, //This might change
    "LDSP": { byteVal: "85", significand: "LOW" },
    "RDSP": { byteVal: "86", significand: "LOW" },
    "DESP": { byteVal: "87", significand: "NONE" }
}

const miscTab = {
    "NOP": { byteVal: "bf", significand: "NONE" },
    "HLT": {byteVal: "be", significand: "NONE"},
    "JMP": {byteVal: "bd", significand: "BOTH"},
    "JZ": {byteVal: "bc", significand: "BOTH"},
    "JNZ": {byteVal: "bb", significand: "BOTH"},
}

exports.regs = {
    "A": "00000000", "B": "00000001", "C": "00000010", "D": "00000011", "RA": "00000100", "IP": "00000101",
};

exports.instructions = {
    immediateUnion: {
        ...miscTab,
        ...skOpTab,
        ...ldImmTab,
        ...stRegTab,
        ...aluOpTab,
    },
    ramUnion: {
        ...ldRamTab,
        ...miscTab,
        ...skOpTab,
        ...stRegTab,
        ...aluOpTab,
    },
    miscTab,
    skOpTab,
    ldRamTab,
    ldImmTab,
    stRegTab,
    aluOpTab
};