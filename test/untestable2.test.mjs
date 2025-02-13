import { describe, test } from "vitest";
import { expect } from "chai";
import { diceHandValue } from "../src/untestable2.mjs";

describe("Untestable 2: a dice game", () => {
  test("between 2-6 or 101-6", () => {
    let value = diceHandValue();
    console.log(value);
    expect((value >= 2 && value <= 6) || (value >= 101 && value <= 106)).to.be.true;
  });

});
