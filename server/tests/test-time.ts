import { expect } from "chai";

import { formatDate, formatTime, formatDateTime } from "../src/lib/utils";

describe("test for date/string conversion", () => {
  it("should return date and time of local time zone", () => {
    const origStr = "2022-01-02T03:04:05";
    const date = new Date(origStr);
    expect(date.getFullYear()).to.be.equal(2022);
    expect(date.getMonth()).to.be.equal(0);
    expect(date.getDate()).to.be.equal(2);
    expect(date.getHours()).to.be.equal(3);
    expect(date.getMinutes()).to.be.equal(4);
    expect(date.getSeconds()).to.be.equal(5);
  });

  it("should interpret as local time", () => {
    const origDate = new Date(2022, 0, 2, 3, 4, 5);
    const utcDate = formatDate(origDate, true);
    const utcTime = formatTime(origDate, true);
    const localDate = formatDate(origDate, false);
    const localTime = formatTime(origDate, false);
    expect(utcDate).to.be.equal("2022-01-01");
    expect(utcTime).to.be.equal("18:04:05");
    expect(localDate).to.be.equal("2022-01-02"); // note: JSTを前提にしている
    expect(localTime).to.be.equal("03:04:05");
  });
});
