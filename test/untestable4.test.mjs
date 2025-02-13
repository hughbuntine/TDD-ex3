import { afterEach, beforeEach, describe, test } from "vitest";
import { PasswordService, PostgresUserDao } from "../src/untestable4.mjs";
import { expect } from "chai";

describe("Untestable 4: enterprise application", () => {
  let service;
  beforeEach(() => {
    service = new PasswordService();
  });

  afterEach(() => {
    PostgresUserDao.getInstance().close();
  });

  test("todo", async () => {
    expect(true).to.be.true;
  });
});
