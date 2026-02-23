import { describe, it, expect } from "vitest";
import {
  registerSchema,
  loginSchema,
  addressSchema,
  reviewSchema,
  checkoutSchema,
  productSchema,
  newsletterSchema,
  couponSchema,
} from "@/lib/validation/schemas";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const validAddress = {
  firstName: "John",
  lastName: "Doe",
  street: "123 Main St",
  city: "Nairobi",
  zipCode: "00100",
  country: "Kenya",
};

// ---------------------------------------------------------------------------
// registerSchema (6 tests)
// ---------------------------------------------------------------------------

describe("registerSchema", () => {
  it("accepts valid input", () => {
    const result = registerSchema.safeParse({
      name: "Francis",
      email: "francis@example.com",
      password: "Secret1234",
    });
    expect(result.success).toBe(true);
  });

  it("rejects name shorter than 2 characters", () => {
    const result = registerSchema.safeParse({
      name: "A",
      email: "francis@example.com",
      password: "Secret1234",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = registerSchema.safeParse({
      name: "Francis",
      email: "not-an-email",
      password: "Secret1234",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password shorter than 8 characters", () => {
    const result = registerSchema.safeParse({
      name: "Francis",
      email: "francis@example.com",
      password: "Se1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password without uppercase letter", () => {
    const result = registerSchema.safeParse({
      name: "Francis",
      email: "francis@example.com",
      password: "secret1234",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password without number", () => {
    const result = registerSchema.safeParse({
      name: "Francis",
      email: "francis@example.com",
      password: "Secretpass",
    });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// loginSchema (3 tests)
// ---------------------------------------------------------------------------

describe("loginSchema", () => {
  it("accepts valid input", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "anything",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "bad-email",
      password: "anything",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// addressSchema (4 tests)
// ---------------------------------------------------------------------------

describe("addressSchema", () => {
  it("accepts valid full address with all optional fields", () => {
    const result = addressSchema.safeParse({
      label: "Home",
      firstName: "John",
      lastName: "Doe",
      street: "123 Main St",
      apartment: "Apt 4B",
      city: "Nairobi",
      state: "Nairobi County",
      zipCode: "00100",
      country: "Kenya",
      phone: "+254712345678",
      isDefault: true,
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid minimal address with only required fields", () => {
    const result = addressSchema.safeParse(validAddress);
    expect(result.success).toBe(true);
  });

  it("rejects missing firstName", () => {
    const { firstName: _, ...noFirst } = validAddress;
    const result = addressSchema.safeParse(noFirst);
    expect(result.success).toBe(false);
  });

  it("rejects missing zipCode", () => {
    const { zipCode: _, ...noZip } = validAddress;
    const result = addressSchema.safeParse(noZip);
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// reviewSchema (4 tests)
// ---------------------------------------------------------------------------

describe("reviewSchema", () => {
  it("accepts valid full review with title and comment", () => {
    const result = reviewSchema.safeParse({
      rating: 4,
      title: "Great product",
      comment: "Really enjoyed using it.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects rating of 0", () => {
    const result = reviewSchema.safeParse({ rating: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects rating of 6", () => {
    const result = reviewSchema.safeParse({ rating: 6 });
    expect(result.success).toBe(false);
  });

  it("accepts valid rating-only review without title or comment", () => {
    const result = reviewSchema.safeParse({ rating: 3 });
    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// checkoutSchema (4 tests)
// ---------------------------------------------------------------------------

describe("checkoutSchema", () => {
  it("accepts valid checkout with CARD payment", () => {
    const result = checkoutSchema.safeParse({
      shippingAddress: validAddress,
      paymentMethod: "CARD",
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid checkout with MPESA payment", () => {
    const result = checkoutSchema.safeParse({
      shippingAddress: validAddress,
      paymentMethod: "MPESA",
      phoneNumber: "+254712345678",
      notes: "Leave at the gate",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid payment method", () => {
    const result = checkoutSchema.safeParse({
      shippingAddress: validAddress,
      paymentMethod: "BITCOIN",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing shippingAddress", () => {
    const result = checkoutSchema.safeParse({
      paymentMethod: "CARD",
    });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// productSchema (5 tests)
// ---------------------------------------------------------------------------

describe("productSchema", () => {
  it("accepts valid full product", () => {
    const result = productSchema.safeParse({
      name: "Wireless Mouse",
      description: "A high-quality wireless mouse with ergonomic design",
      price: 29.99,
      compareAt: 49.99,
      categoryId: "cat-electronics",
      stock: 100,
      isActive: true,
      isFeatured: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing name", () => {
    const result = productSchema.safeParse({
      description: "A valid description here",
      price: 10,
      categoryId: "cat-1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative price", () => {
    const result = productSchema.safeParse({
      name: "Widget",
      description: "A valid description here",
      price: -5,
      categoryId: "cat-1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects description shorter than 10 characters", () => {
    const result = productSchema.safeParse({
      name: "Widget",
      description: "Too short",
      price: 10,
      categoryId: "cat-1",
    });
    expect(result.success).toBe(false);
  });

  it("applies defaults for stock, isActive, and isFeatured", () => {
    const result = productSchema.safeParse({
      name: "Widget",
      description: "A valid description here",
      price: 10,
      categoryId: "cat-1",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.stock).toBe(0);
      expect(result.data.isActive).toBe(true);
      expect(result.data.isFeatured).toBe(false);
    }
  });
});

// ---------------------------------------------------------------------------
// newsletterSchema (2 tests)
// ---------------------------------------------------------------------------

describe("newsletterSchema", () => {
  it("accepts valid email", () => {
    const result = newsletterSchema.safeParse({ email: "hello@luxora.com" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = newsletterSchema.safeParse({ email: "not-valid" });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// couponSchema (4 tests)
// ---------------------------------------------------------------------------

describe("couponSchema", () => {
  it("accepts valid percentage coupon", () => {
    const result = couponSchema.safeParse({
      code: "SAVE20",
      discountType: "percentage",
      discountValue: 20,
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid fixed coupon", () => {
    const result = couponSchema.safeParse({
      code: "FLAT500",
      description: "Flat 500 off",
      discountType: "fixed",
      discountValue: 500,
      minOrder: 1000,
      maxUses: 100,
      isActive: true,
      expiresAt: "2026-12-31T23:59:59.000Z",
    });
    expect(result.success).toBe(true);
  });

  it("rejects code shorter than 3 characters", () => {
    const result = couponSchema.safeParse({
      code: "AB",
      discountType: "percentage",
      discountValue: 10,
    });
    expect(result.success).toBe(false);
  });

  it("auto-uppercases the code", () => {
    const result = couponSchema.safeParse({
      code: "abc",
      discountType: "percentage",
      discountValue: 10,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.code).toBe("ABC");
    }
  });
});
