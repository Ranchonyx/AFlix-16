const {programStructure} = require("./constants")


exports.createRomLayout = (linkFile, nodeList) => {

    let programStructure = JSON.parse(linkFile);

    let sections = new Map();
    let buffer = Buffer.alloc(3 * programStructure.size, "bf0000", "hex");

    for (let { section, assembly } of nodeList) {

        let array = sections.get(section) ?? [];
        array.push(assembly);

        sections.set(section, array);
    }

    function writeSection(section) {
        console.log(`Writing section \"${section}\"...`);
        let assembly = sections.get(section);

        console.log(`Writing ${assembly.length} words.`);

        let ctr = 3 * programStructure.sections[section].start;

        while (assembly.length !== 0) {
            let slab = assembly.pop();

            buffer.set(slab, ctr);

            ctr += 3;
        }

    }

    for(let entry of sections.entries()) {
        writeSection(entry[0]);
    }

    return buffer;
}