const { exit } = require("process");
const { programStructure, instructions } = require("./constants")
exports.createRomLayout = (linkFile, nodeList) => {

    let programStructure = JSON.parse(linkFile);

    let sections = new Map();
    let buffer = Buffer.alloc(3 * programStructure.size, "bf0000", "hex");

    for (let node of nodeList) {
        let array = sections.get(node.section) ?? [];
        // console.log(node);
        array.push({ opcode: node.opcode, assembly: node.assembly, sectionStart: node.sectionStart, sectionStop: node.sectionStop });

        sections.set(node.section, array);
    }

    function writeSection(section, offset = undefined) {
        console.log(`Writing section \"${section}\"...`);
        let part = sections.get(section);

        console.log(`Writing ${part.length} words.`);

        let ctr = null;
        if (offset != undefined) {
            ctr = 3 * offset;
        } else {
            ctr = 3 * programStructure.sections[section].start;
        }

        for (let asm of part) {
            let slab = asm.assembly;
            console.log(`Writing ${slab.toString("hex")} (${asm.opcode}) @ $${(ctr / 3).toString(16).padStart(4, 0)}`);
            buffer.set(slab, ctr += 3);
        }
        if(section === "bootstrap") {
            //Append tail jump to program
            let asm = Buffer.from(`bd${sections.get("program")[0].sectionStart.toString(16).padStart(4, 0)}`, "hex");
            console.log(`Inserting ${asm.toString("hex")} @ $${(ctr / 3).toString(16).padStart(4, 0)}`);
            buffer.set(asm, ctr + 3);
        }
    }

    function hasSection(map, fnd) {
        for (let entry of map.entries()) {
            if (entry[0] === fnd) return true;
        }
        return false;
    }

    if (hasSection(sections, "functions")) {
        writeSection("functions", 0x0000);

        for (let entry of sections.entries()) {
            if (entry[0] === "program") {
                writeSection(entry[0], sections.get("program")[0].sectionStart);
            }
            if (entry[0] === "bootstrap") {
                writeSection(entry[0], programStructure.sections["bootstrap"].start)
            }
        }
    } else {
        for (let entry of sections.entries()) {
            writeSection(entry[0]);
        }
    }

    return buffer;
}