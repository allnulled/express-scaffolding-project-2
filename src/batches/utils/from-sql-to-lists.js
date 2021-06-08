module.exports = function (data) {
    if (!Array.isArray(data)) {
        throw new Error("Required argument «data» to be an array [789413215965213]");
    }
    if (data.length === 0) {
        return {};
    }
    const firstItem = data[0];
    const firstItemKeys = Object.keys(firstItem);
    const firstItemTables = firstItemKeys.reduce((output, key) => {
        const ids = key.split(".");
        if (ids.length === 2) {
            if (output.indexOf(ids[0]) === -1) {
                output.push(ids[0]);
            }
        }
        return output;
    }, []);
    const finalOutput = {};
    for (let index = 0; index < firstItemTables.length; index++) {
        const itemTable = firstItemTables[index];
        const itemData = this.utils.fromSqlToObject(data, itemTable);
        if (!(itemTable in finalOutput)) {
            finalOutput[itemTable] = {};
        }
        for (let indexItems = 0; indexItems < itemData.length; indexItems++) {
            const itemUnit = itemData[indexItems];
            const itemId = itemUnit.id;
            finalOutput[itemTable][itemId] = itemUnit;
        }
    }
    return finalOutput;
}