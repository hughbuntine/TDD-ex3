import { describe, test, afterAll } from "vitest";
import { expect } from "chai";
import { parsePeopleCsv } from "../src/untestable3.mjs";
import fs from "fs";

// example input:
// Loid,Forger,,Male
// Anya,Forger,6,Female
// Yor,Forger,27,Female

describe("Untestable 3: CSV file parsing", () => {
  // Example data
  const sampleData = [
    { name: "Loid", lastName: "Forger", age: "", gender: "Male" },
    { name: "Anya", lastName: "Forger", age: "6", gender: "Female" },
    { name: "Yor", lastName: "Forger", age: "27", gender: "Female" },
  ];

  const resultData = [
    { firstName: "Loid", lastName: "Forger", gender: "m" },
    { firstName: "Anya", lastName: "Forger", age: 6, gender: "f" },
    { firstName: "Yor", lastName: "Forger", age: 27, gender: "f" },
  ];

  // Convert the data to CSV format
  const csvData = sampleData
    .map((person) => Object.values(person).join(","))
    .join("\n");

  // Write the CSV data to a file
  fs.writeFileSync("people.csv", csvData);
  

  test("test", async () => {
    expect(await parsePeopleCsv("people.csv")).toMatchObject(resultData);
  });

});

afterAll(() => {
  fs.unlinkSync("people.csv");
})
