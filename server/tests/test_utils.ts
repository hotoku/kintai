import { expect, assert } from "chai";

import { parseDateTime, InvalidFormat } from "../src/lib/date-time-util";

describe("parser test", () => {
  it("should not raise error", () => {
    parseDateTime("2022-01-02T03:04:05.006+09:00");
  });
  it("should raise format error", () => {
    try {
      parseDateTime("hoge");
      assert(false, "format validation does not work.");
    } catch (e: any) {
      assert(e instanceof InvalidFormat, "invalid exception is raised.");
    }
  });
  it("should build date object", () => {
    const date = parseDateTime("2022-01-02T03:04:05.006+09:00");
    expect(date.getFullYear()).to.be.equal(2022);
    expect(date.getMonth()).to.be.equal(1);
  });
});
