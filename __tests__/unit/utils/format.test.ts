import { describe, it, expect } from "vitest";
import {
  formatPrice,
  formatDate,
  formatOrderNumber,
  slugify,
  truncate,
  getDiscountPercentage,
  generateOrderNumber,
  cn,
} from "@/lib/utils/format";

// ---------------------------------------------------------------------------
// formatPrice (4 tests)
// ---------------------------------------------------------------------------

describe("formatPrice", () => {
  it("formats $10.00", () => {
    expect(formatPrice(10)).toBe("$10.00");
  });

  it("formats $1,234.56 with thousands separator", () => {
    expect(formatPrice(1234.56)).toBe("$1,234.56");
  });

  it("formats EUR currency as €50.00", () => {
    expect(formatPrice(50, "EUR")).toBe("€50.00");
  });

  it("formats $0.00", () => {
    expect(formatPrice(0)).toBe("$0.00");
  });
});

// ---------------------------------------------------------------------------
// formatDate (1 test)
// ---------------------------------------------------------------------------

describe("formatDate", () => {
  it('formats a known date containing "June", "15", and "2024"', () => {
    const result = formatDate(new Date("2024-06-15"));
    expect(result).toContain("June");
    expect(result).toContain("15");
    expect(result).toContain("2024");
  });
});

// ---------------------------------------------------------------------------
// formatOrderNumber (2 tests)
// ---------------------------------------------------------------------------

describe("formatOrderNumber", () => {
  it('prefixes "ABC123" with "#"', () => {
    expect(formatOrderNumber("ABC123")).toBe("#ABC123");
  });

  it('returns "#" for an empty string', () => {
    expect(formatOrderNumber("")).toBe("#");
  });
});

// ---------------------------------------------------------------------------
// slugify (5 tests)
// ---------------------------------------------------------------------------

describe("slugify", () => {
  it('converts "Hello World" to "hello-world"', () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("removes non-word special characters from accented text", () => {
    expect(slugify("Café & Résumé")).toBe("caf-rsum");
  });

  it("collapses multiple spaces into single hyphens", () => {
    expect(slugify("  multiple   spaces  ")).toBe("-multiple-spaces-");
  });

  it("collapses multiple hyphens into a single hyphen", () => {
    expect(slugify("--leading-trailing--")).toBe("-leading-trailing-");
  });

  it('returns "" for an empty string', () => {
    expect(slugify("")).toBe("");
  });
});

// ---------------------------------------------------------------------------
// truncate (3 tests)
// ---------------------------------------------------------------------------

describe("truncate", () => {
  it("returns short text unchanged when under the limit", () => {
    expect(truncate("Hi", 10)).toBe("Hi");
  });

  it('cuts long text and appends "..."', () => {
    expect(truncate("Hello, World!", 5)).toBe("Hello...");
  });

  it("returns text unchanged when exactly at the limit", () => {
    expect(truncate("12345", 5)).toBe("12345");
  });
});

// ---------------------------------------------------------------------------
// getDiscountPercentage (4 tests)
// ---------------------------------------------------------------------------

describe("getDiscountPercentage", () => {
  it("calculates 20% discount (price 80, compareAt 100)", () => {
    expect(getDiscountPercentage(80, 100)).toBe(20);
  });

  it("calculates 75% discount (price 50, compareAt 200)", () => {
    expect(getDiscountPercentage(50, 200)).toBe(75);
  });

  it("returns 0 when compareAt is 0", () => {
    expect(getDiscountPercentage(80, 0)).toBe(0);
  });

  it("returns 0 when compareAt is less than price", () => {
    expect(getDiscountPercentage(100, 50)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// generateOrderNumber (3 tests)
// ---------------------------------------------------------------------------

describe("generateOrderNumber", () => {
  it('starts with "LX-"', () => {
    expect(generateOrderNumber()).toMatch(/^LX-/);
  });

  it("has length greater than 5", () => {
    expect(generateOrderNumber().length).toBeGreaterThan(5);
  });

  it("produces different results on successive calls", () => {
    const a = generateOrderNumber();
    const b = generateOrderNumber();
    expect(a).not.toBe(b);
  });
});

// ---------------------------------------------------------------------------
// cn (4 tests)
// ---------------------------------------------------------------------------

describe("cn", () => {
  it('joins "a" and "b" into "a b"', () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("filters out undefined values", () => {
    expect(cn("a", undefined, "b")).toBe("a b");
  });

  it("filters out false and null values", () => {
    expect(cn("a", false, null, "b")).toBe("a b");
  });

  it('returns "" when called with no arguments', () => {
    expect(cn()).toBe("");
  });
});
