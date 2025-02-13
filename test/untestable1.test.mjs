import { describe, test } from "vitest";
import { expect } from "chai";
import { daysUntilChristmas } from "../src/untestable1.mjs";

describe("Untestable 1: days until Christmas", () => {
  test("Feb 13 2025", () => {
    let testDate = new Date("2025-02-13T14:30:37.295Z");
    // TODO: write proper tests
    expect(daysUntilChristmas(testDate)).to.equal(315);
  });

  test("Dec 25 2025", () => {
    let testDate = new Date(2025, 11, 25);
    // TODO: write proper tests
    expect(daysUntilChristmas(testDate)).to.equal(0);
  });

  test("Dec 26 2025", () => {
    let testDate = new Date(2025, 11, 26);
    // TODO: write proper tests
    expect(daysUntilChristmas(testDate)).to.equal(364);
  });

});
