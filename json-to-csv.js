const fs = require("fs");
const path = require("path");

function jsonToCsv(json) {
    const data = Array.isArray(json) ? json : [json];

    if (data.length === 0) return "";

    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(header => JSON.stringify(row[header] || "")).join(","));

    return [headers.join(","), ...rows].join("\n");
}

function convertFile(inputPath, outputPath) {
    fs.readFile(inputPath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return;
        }

        try {
            const jsonData = JSON.parse(data);
            const csv = jsonToCsv(jsonData);

            fs.writeFile(outputPath, csv, "utf8", err => {
                if (err) {
                    console.error("Error writing file:", err);
                } else {
                    console.log(`CSV saved in ${outputPath}`);
                }
            });
        } catch (error) {
            console.error("Error while parsing JSON:", error);
        }
    });
}

// Example of usage from the command line
if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.length !== 2) {
        console.log("Using: node json-to-csv.js input.json output.csv");
        process.exit(1);
    }

    const [inputFile, outputFile] = args.map(f => path.resolve(f));
    convertFile(inputFile, outputFile);
}

module.exports = { jsonToCsv, convertFile };

