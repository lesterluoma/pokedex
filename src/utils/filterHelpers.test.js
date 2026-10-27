import { describe, expect, it } from "vitest";
import {
  hasActiveFilters,
  isInIdRange,
  oneOf,
  toWholeNumber,
} from "./filterHelpers";

describe("oneOf", () => {
  it("keeps allowed values and drops everything else", () => {
    expect(oneOf("fire", ["fire", "water"])).toBe("fire");
    expect(oneOf("banana", ["fire", "water"])).toBeNull();
    expect(oneOf(null, ["fire", "water"])).toBeNull();
  });
});

describe("toWholeNumber", () => {
  it("reads whole numbers only", () => {
    expect(toWholeNumber("151")).toBe(151);
    expect(toWholeNumber("0")).toBe(0);
    expect(toWholeNumber("1.5")).toBeNull();
    expect(toWholeNumber("-3")).toBeNull();
    expect(toWholeNumber("abc")).toBeNull();
    expect(toWholeNumber("")).toBeNull();
    expect(toWholeNumber(null)).toBeNull();
  });
});

describe("hasActiveFilters", () => {
  it("is true when any filter has a value", () => {
    expect(hasActiveFilters({ type: null, to: null })).toBe(false);
    expect(hasActiveFilters({ type: null, to: 151 })).toBe(true);
    expect(hasActiveFilters({ type: "fire", to: null })).toBe(true);
  });
});

describe("isInIdRange", () => {
  it("includes both ends and treats null as no limit", () => {
    expect(isInIdRange(1, 1, 151)).toBe(true);
    expect(isInIdRange(151, 1, 151)).toBe(true);
    expect(isInIdRange(152, 1, 151)).toBe(false);
    expect(isInIdRange(500, null, null)).toBe(true);
    expect(isInIdRange(5, 10, null)).toBe(false);
    expect(isInIdRange(5, null, 4)).toBe(false);
  });
});
