"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  CreditCard,
  ClipboardCheck,
  ChevronRight,
  ChevronLeft,
  Smartphone,
  Loader2,
  Package,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { formatPrice, cn } from "@/lib/utils/format";
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: { url: string; alt: string | null }[];
  };
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  street: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

type PaymentMethodType = "CARD" | "PAYPAL" | "MPESA" | "MTN_MOMO";

const STEPS = [
  { id: 1, label: "Shipping", icon: MapPin },
  { id: 2, label: "Payment", icon: CreditCard },
  { id: 3, label: "Review", icon: ClipboardCheck },
] as const;

const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 9.99;

const INITIAL_ADDRESS: ShippingAddress = {
  firstName: "",
  lastName: "",
  street: "",
  apartment: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  phone: "",
};

// ---------------------------------------------------------------------------
// Stripe lazy-load
// ---------------------------------------------------------------------------

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StepIndicator({
  currentStep,
}: {
  currentStep: number;
}) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 sm:mb-12">
      {STEPS.map((step, index) => {
        const Icon = step.icon;
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  isActive &&
                    "bg-gold-400/10 border-gold-400 text-gold-400 shadow-lg shadow-gold-400/20",
                  isCompleted &&
                    "bg-gold-400 border-gold-400 text-charcoal-950",
                  !isActive &&
                    !isCompleted &&
                    "border-charcoal-600 text-charcoal-500"
                )}
              >
                {isCompleted ? (
                  <ShieldCheck className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs sm:text-sm font-medium",
                  isActive && "text-gold-400",
                  isCompleted && "text-charcoal-200",
                  !isActive && !isCompleted && "text-charcoal-500"
                )}
              >
                {step.label}
              </span>
            </div>

            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "w-12 sm:w-20 h-0.5 mx-2 sm:mx-4 mt-[-1.25rem]",
                  step.id < currentStep
                    ? "bg-gold-400"
                    : "bg-charcoal-700"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function AddressField({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-charcoal-200 mb-1.5"
      >
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        className={cn(
          "input-field",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500"
        )}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stripe Elements form (dynamically imported to avoid SSR issues)
// ---------------------------------------------------------------------------

function StripePaymentForm({
  clientSecret,
  onSuccess,
  onError,
  isProcessing,
  setIsProcessing,
}: {
  clientSecret: string;
  onSuccess: () => void;
  onError: (message: string) => void;
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [StripeComponents, setStripeComponents] = useState<{
    Elements: React.ComponentType<{ stripe: unknown; options: StripeElementsOptions; children: React.ReactNode }>;
    PaymentElement: React.ComponentType;
    useStripe: () => ReturnType<typeof import("@stripe/stripe-js")["loadStripe"]> extends Promise<infer T> ? T : never;
    useElements: () => unknown;
  } | null>(null);

  useEffect(() => {
    import("@stripe/react-stripe-js").then((mod) => {
      setStripeComponents({
        Elements: mod.Elements as unknown as typeof StripeComponents extends null ? never : NonNullable<typeof StripeComponents>["Elements"],
        PaymentElement: mod.PaymentElement as unknown as React.ComponentType,
        useStripe: mod.useStripe as unknown as NonNullable<typeof StripeComponents>["useStripe"],
        useElements: mod.useElements as unknown as NonNullable<typeof StripeComponents>["useElements"],
      });
      setMounted(true);
    });
  }, []);

  if (!mounted || !StripeComponents) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-gold-400" />
        <span className="ml-3 text-charcoal-300">Loading payment form...</span>
      </div>
    );
  }

  const { Elements, PaymentElement } = StripeComponents;

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "night",
      variables: {
        colorPrimary: "#d99a2b",
        colorBackground: "#141414",
        colorText: "#e0e0e0",
        colorDanger: "#ef4444",
        borderRadius: "8px",
        fontFamily: "system-ui, sans-serif",
      },
      rules: {
        ".Input": {
          border: "1px solid #2d2d2d",
          backgroundColor: "#0a0a0a",
        },
        ".Input:focus": {
          border: "1px solid #d99a2b",
          boxShadow: "0 0 0 1px #d99a2b",
        },
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <StripeInnerForm
        onSuccess={onSuccess}
        onError={onError}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
        PaymentElement={PaymentElement}
        useStripeHook={StripeComponents.useStripe}
        useElementsHook={StripeComponents.useElements}
      />
    </Elements>
  );
}

function StripeInnerForm({
  onSuccess,
  onError,
  isProcessing,
  setIsProcessing,
  PaymentElement,
  useStripeHook,
  useElementsHook,
}: {
  onSuccess: () => void;
  onError: (message: string) => void;
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;
  PaymentElement: React.ComponentType;
  useStripeHook: () => unknown;
  useElementsHook: () => unknown;
}) {
  const stripeInstance = useStripeHook() as Awaited<ReturnType<typeof loadStripe>>;
  const elements = useElementsHook() as { submit: () => Promise<{ error?: { message: string } }> } | null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripeInstance || !elements) return;

    setIsProcessing(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      onError(submitError.message || "Payment submission failed");
      setIsProcessing(false);
      return;
    }

    const { error } = await (stripeInstance as unknown as {
      confirmPayment: (opts: {
        elements: unknown;
        confirmParams: { return_url: string };
        redirect: string;
      }) => Promise<{ error?: { message: string } }>;
    }).confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
      redirect: "if_required",
    });

    if (error) {
      onError(error.message || "Payment failed");
      setIsProcessing(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripeInstance || isProcessing}
        className={cn(
          "w-full py-3 px-6 rounded-lg font-medium text-base transition-all duration-200",
          "bg-gold-400 text-charcoal-950 hover:bg-gold-300",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "inline-flex items-center justify-center gap-2"
        )}
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <ShieldCheck className="h-5 w-5" />
            Pay Now
          </>
        )}
      </button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Order Summary sidebar
// ---------------------------------------------------------------------------

function OrderSummary({ items }: { items: CartItem[] }) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const tax = subtotal * TAX_RATE;
  const shipping =
    subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + tax + shipping;

  return (
    <div className="bg-charcoal-900 border border-charcoal-700 rounded-2xl p-6 sticky top-8">
      <h3 className="text-lg font-heading font-semibold text-charcoal-100 mb-4">
        Order Summary
      </h3>

      {/* Items */}
      <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="relative w-14 h-14 bg-charcoal-800 rounded-lg overflow-hidden flex-shrink-0">
              {item.product.images[0] ? (
                <img
                  src={item.product.images[0].url}
                  alt={item.product.images[0].alt || item.product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-6 w-6 text-charcoal-600" />
                </div>
              )}
              <span className="absolute -top-1 -right-1 bg-gold-400 text-charcoal-950 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-charcoal-200 truncate">
                {item.product.name}
              </p>
              <p className="text-sm text-charcoal-400">
                {formatPrice(item.product.price)} x {item.quantity}
              </p>
            </div>
            <p className="text-sm font-medium text-charcoal-100">
              {formatPrice(item.product.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-charcoal-700 pt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-charcoal-400">Subtotal</span>
          <span className="text-charcoal-200">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-charcoal-400 flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5" /> Shipping
          </span>
          <span className="text-charcoal-200">
            {shipping === 0 ? (
              <span className="text-green-400">Free</span>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-charcoal-400">Tax (8%)</span>
          <span className="text-charcoal-200">{formatPrice(tax)}</span>
        </div>
        <div className="border-t border-charcoal-700 pt-3 flex justify-between">
          <span className="text-base font-semibold text-charcoal-100">
            Total
          </span>
          <span className="text-base font-bold text-gold-400">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      {subtotal < FREE_SHIPPING_THRESHOLD && (
        <p className="mt-4 text-xs text-charcoal-400 text-center">
          Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free
          shipping
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Checkout Page
// ---------------------------------------------------------------------------

export default function CheckoutPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddress>(INITIAL_ADDRESS);
  const [addressErrors, setAddressErrors] = useState<
    Record<string, string>
  >({});
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodType>("CARD");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [notes, setNotes] = useState("");

  // Stripe
  const [clientSecret, setClientSecret] = useState("");

  // Fetch cart items on mount
  useEffect(() => {
    async function fetchCart() {
      try {
        const res = await fetch("/api/cart");
        if (!res.ok) throw new Error("Failed to load cart");
        const data = await res.json();
        setCartItems(data.items || []);
      } catch {
        setError("Failed to load your cart. Please try again.");
      } finally {
        setIsLoadingCart(false);
      }
    }
    fetchCart();
  }, []);

  // Address change handler
  const handleAddressChange = useCallback(
    (name: string, value: string) => {
      setShippingAddress((prev) => ({ ...prev, [name]: value }));
      if (addressErrors[name]) {
        setAddressErrors((prev) => {
          const next = { ...prev };
          delete next[name];
          return next;
        });
      }
    },
    [addressErrors]
  );

  // Validate shipping address
  const validateShippingAddress = (): boolean => {
    const errors: Record<string, string> = {};
    if (!shippingAddress.firstName.trim())
      errors.firstName = "First name is required";
    if (!shippingAddress.lastName.trim())
      errors.lastName = "Last name is required";
    if (!shippingAddress.street.trim())
      errors.street = "Street address is required";
    if (!shippingAddress.city.trim()) errors.city = "City is required";
    if (!shippingAddress.zipCode.trim())
      errors.zipCode = "ZIP code is required";
    if (!shippingAddress.country.trim())
      errors.country = "Country is required";

    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Navigation
  const goNext = () => {
    if (currentStep === 1) {
      if (!validateShippingAddress()) return;
    }
    if (currentStep === 2) {
      if (
        (paymentMethod === "MPESA" || paymentMethod === "MTN_MOMO") &&
        !phoneNumber.trim()
      ) {
        setError("Phone number is required for mobile money payments");
        return;
      }
    }
    setError("");
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const goBack = () => {
    setError("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Submit order
  const handleSubmitOrder = async () => {
    setIsProcessing(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingAddress,
          paymentMethod,
          phoneNumber:
            paymentMethod === "MPESA" || paymentMethod === "MTN_MOMO"
              ? phoneNumber
              : undefined,
          notes: notes || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create order");
        setIsProcessing(false);
        return;
      }

      if (paymentMethod === "CARD" && data.clientSecret) {
        setClientSecret(data.clientSecret);
        setIsProcessing(false);
        return;
      }

      if (paymentMethod === "PAYPAL") {
        // For PayPal, redirect to success (in production, integrate PayPal SDK)
        router.push(
          `/checkout/success?orderId=${data.orderId}&orderNumber=${data.orderNumber}`
        );
        return;
      }

      if (paymentMethod === "MPESA" || paymentMethod === "MTN_MOMO") {
        // Mobile money: redirect to success with pending status
        router.push(
          `/checkout/success?orderId=${data.orderId}&orderNumber=${data.orderNumber}&pending=true`
        );
        return;
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsProcessing(false);
    }
  };

  // Stripe success
  const handleStripeSuccess = () => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("orderId");
    router.push(
      `/checkout/success${orderId ? `?orderId=${orderId}` : ""}`
    );
  };

  // Payment method options
  const paymentMethods: {
    value: PaymentMethodType;
    label: string;
    description: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: "CARD",
      label: "Credit / Debit Card",
      description: "Pay securely with Stripe",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      value: "PAYPAL",
      label: "PayPal",
      description: "Pay with your PayPal account",
      icon: (
        <span className="text-sm font-bold tracking-tight">PP</span>
      ),
    },
    {
      value: "MPESA",
      label: "M-Pesa",
      description: "Pay via M-Pesa mobile money",
      icon: <Smartphone className="h-5 w-5" />,
    },
    {
      value: "MTN_MOMO",
      label: "MTN Mobile Money",
      description: "Pay via MTN MoMo",
      icon: <Smartphone className="h-5 w-5" />,
    },
  ];

  // Loading state
  if (isLoadingCart) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-gold-400" />
          <span className="ml-3 text-charcoal-300 text-lg">
            Loading checkout...
          </span>
        </div>
      </div>
    );
  }

  // Empty cart
  if (cartItems.length === 0 && !clientSecret) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-24">
          <Package className="h-16 w-16 text-charcoal-600 mx-auto mb-4" />
          <h2 className="text-2xl font-heading font-semibold text-charcoal-100 mb-2">
            Your cart is empty
          </h2>
          <p className="text-charcoal-400 mb-8">
            Add some items to your cart before checking out.
          </p>
          <button
            onClick={() => router.push("/shop")}
            className="px-6 py-3 bg-gold-400 text-charcoal-950 font-medium rounded-lg hover:bg-gold-300 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // If Stripe payment form is active
  if (clientSecret) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-heading font-semibold text-charcoal-100 mb-2 text-center">
            Complete Payment
          </h2>
          <p className="text-charcoal-400 text-center mb-8">
            Enter your card details to finalize your order.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="bg-charcoal-900 border border-charcoal-700 rounded-2xl p-6">
            <StripePaymentForm
              clientSecret={clientSecret}
              onSuccess={handleStripeSuccess}
              onError={(msg) => setError(msg)}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <StepIndicator currentStep={currentStep} />

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm max-w-4xl mx-auto">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-charcoal-900 border border-charcoal-700 rounded-2xl p-6 sm:p-8">
            {/* Step 1: Shipping Address */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-xl font-heading font-semibold text-charcoal-100 mb-6 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gold-400" />
                  Shipping Address
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AddressField
                    label="First Name"
                    name="firstName"
                    value={shippingAddress.firstName}
                    onChange={handleAddressChange}
                    error={addressErrors.firstName}
                    required
                    placeholder="John"
                  />
                  <AddressField
                    label="Last Name"
                    name="lastName"
                    value={shippingAddress.lastName}
                    onChange={handleAddressChange}
                    error={addressErrors.lastName}
                    required
                    placeholder="Doe"
                  />
                  <div className="sm:col-span-2">
                    <AddressField
                      label="Street Address"
                      name="street"
                      value={shippingAddress.street}
                      onChange={handleAddressChange}
                      error={addressErrors.street}
                      required
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <AddressField
                      label="Apartment, suite, etc."
                      name="apartment"
                      value={shippingAddress.apartment}
                      onChange={handleAddressChange}
                      placeholder="Apt 4B (optional)"
                    />
                  </div>
                  <AddressField
                    label="City"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleAddressChange}
                    error={addressErrors.city}
                    required
                    placeholder="New York"
                  />
                  <AddressField
                    label="State / Province"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleAddressChange}
                    placeholder="NY"
                  />
                  <AddressField
                    label="ZIP / Postal Code"
                    name="zipCode"
                    value={shippingAddress.zipCode}
                    onChange={handleAddressChange}
                    error={addressErrors.zipCode}
                    required
                    placeholder="10001"
                  />
                  <AddressField
                    label="Country"
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleAddressChange}
                    error={addressErrors.country}
                    required
                    placeholder="United States"
                  />
                  <div className="sm:col-span-2">
                    <AddressField
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={handleAddressChange}
                      placeholder="+1 (555) 123-4567 (optional)"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-xl font-heading font-semibold text-charcoal-100 mb-6 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-gold-400" />
                  Payment Method
                </h2>

                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.value}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                        paymentMethod === method.value
                          ? "border-gold-400 bg-gold-400/5"
                          : "border-charcoal-700 hover:border-charcoal-600 bg-charcoal-800/50"
                      )}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={paymentMethod === method.value}
                        onChange={() =>
                          setPaymentMethod(method.value)
                        }
                        className="sr-only"
                      />
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                          paymentMethod === method.value
                            ? "border-gold-400"
                            : "border-charcoal-500"
                        )}
                      >
                        {paymentMethod === method.value && (
                          <div className="w-2.5 h-2.5 rounded-full bg-gold-400" />
                        )}
                      </div>
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                          paymentMethod === method.value
                            ? "bg-gold-400/10 text-gold-400"
                            : "bg-charcoal-700 text-charcoal-400"
                        )}
                      >
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-charcoal-100">
                          {method.label}
                        </p>
                        <p className="text-sm text-charcoal-400">
                          {method.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Phone number for mobile money */}
                {(paymentMethod === "MPESA" ||
                  paymentMethod === "MTN_MOMO") && (
                  <div className="mt-6">
                    <AddressField
                      label="Mobile Money Phone Number"
                      name="phoneNumber"
                      type="tel"
                      value={phoneNumber}
                      onChange={(_, value) => setPhoneNumber(value)}
                      required
                      placeholder={
                        paymentMethod === "MPESA"
                          ? "+254 7XX XXX XXX"
                          : "+256 7XX XXX XXX"
                      }
                    />
                    <p className="mt-2 text-xs text-charcoal-400">
                      {paymentMethod === "MPESA"
                        ? "You will receive an STK push notification on this number to complete payment."
                        : "You will receive a payment request on this number to approve."}
                    </p>
                  </div>
                )}

                {/* Order notes */}
                <div className="mt-6">
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-charcoal-200 mb-1.5"
                  >
                    Order Notes (optional)
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    maxLength={500}
                    placeholder="Special delivery instructions, gift message, etc."
                    className="input-field resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Review & Pay */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-xl font-heading font-semibold text-charcoal-100 mb-6 flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-gold-400" />
                  Review Your Order
                </h2>

                {/* Shipping address review */}
                <div className="mb-6 p-4 bg-charcoal-800/50 rounded-xl border border-charcoal-700">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-charcoal-300 uppercase tracking-wider">
                      Shipping Address
                    </h3>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="text-sm text-gold-400 hover:text-gold-300 transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-charcoal-200">
                    {shippingAddress.firstName} {shippingAddress.lastName}
                  </p>
                  <p className="text-charcoal-300 text-sm">
                    {shippingAddress.street}
                    {shippingAddress.apartment &&
                      `, ${shippingAddress.apartment}`}
                  </p>
                  <p className="text-charcoal-300 text-sm">
                    {shippingAddress.city}
                    {shippingAddress.state &&
                      `, ${shippingAddress.state}`}{" "}
                    {shippingAddress.zipCode}
                  </p>
                  <p className="text-charcoal-300 text-sm">
                    {shippingAddress.country}
                  </p>
                  {shippingAddress.phone && (
                    <p className="text-charcoal-400 text-sm mt-1">
                      {shippingAddress.phone}
                    </p>
                  )}
                </div>

                {/* Payment method review */}
                <div className="mb-6 p-4 bg-charcoal-800/50 rounded-xl border border-charcoal-700">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-charcoal-300 uppercase tracking-wider">
                      Payment Method
                    </h3>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="text-sm text-gold-400 hover:text-gold-300 transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-charcoal-200">
                    {paymentMethods.find((m) => m.value === paymentMethod)
                      ?.label || paymentMethod}
                  </p>
                  {(paymentMethod === "MPESA" ||
                    paymentMethod === "MTN_MOMO") &&
                    phoneNumber && (
                      <p className="text-charcoal-400 text-sm mt-1">
                        Phone: {phoneNumber}
                      </p>
                    )}
                </div>

                {/* Items review */}
                <div className="mb-6 p-4 bg-charcoal-800/50 rounded-xl border border-charcoal-700">
                  <h3 className="text-sm font-medium text-charcoal-300 uppercase tracking-wider mb-3">
                    Items ({cartItems.length})
                  </h3>
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-charcoal-700 rounded-lg overflow-hidden flex-shrink-0">
                            {item.product.images[0] ? (
                              <img
                                src={item.product.images[0].url}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-4 w-4 text-charcoal-500" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-charcoal-200">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-charcoal-400">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-charcoal-200">
                          {formatPrice(
                            item.product.price * item.quantity
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {notes && (
                  <div className="mb-6 p-4 bg-charcoal-800/50 rounded-xl border border-charcoal-700">
                    <h3 className="text-sm font-medium text-charcoal-300 uppercase tracking-wider mb-2">
                      Order Notes
                    </h3>
                    <p className="text-sm text-charcoal-300">{notes}</p>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  onClick={goBack}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-charcoal-300 hover:text-charcoal-100 transition-colors rounded-lg border border-charcoal-700 hover:border-charcoal-600"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
              ) : (
                <div />
              )}

              {currentStep < 3 ? (
                <button
                  onClick={goNext}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gold-400 text-charcoal-950 font-medium rounded-lg hover:bg-gold-300 transition-colors"
                >
                  Continue
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitOrder}
                  disabled={isProcessing}
                  className={cn(
                    "inline-flex items-center gap-2 px-8 py-3 bg-gold-400 text-charcoal-950 font-semibold rounded-lg hover:bg-gold-300 transition-all duration-200",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-5 w-5" />
                      Place Order
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <OrderSummary items={cartItems} />
        </div>
      </div>
    </div>
  );
}
