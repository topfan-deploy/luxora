"use client";

import { useState } from "react";
import { Mail, ArrowRight, Loader2, CheckCircle } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "You have been subscribed successfully!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please check your connection and try again.");
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-charcoal-950 to-charcoal-900">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-charcoal-800 border border-charcoal-700 mb-6">
            <Mail className="h-6 w-6 text-gold-400" />
          </div>

          {/* Heading */}
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-charcoal-100">
            Stay in the <span className="gold-text">Loop</span>
          </h2>

          {/* Description */}
          <p className="mt-4 text-charcoal-400 max-w-lg mx-auto">
            Subscribe to our newsletter for exclusive deals, new arrivals, and
            curated recommendations delivered straight to your inbox.
          </p>

          {/* Form */}
          {status === "success" ? (
            <div className="mt-8 flex items-center justify-center gap-3 bg-charcoal-900 border border-charcoal-700 rounded-xl p-6">
              <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
              <p className="text-charcoal-200">{message}</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") {
                    setStatus("idle");
                    setMessage("");
                  }
                }}
                placeholder="Enter your email address"
                className="input-field flex-1 text-sm"
                required
                disabled={status === "loading"}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap text-sm"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Error Message */}
          {status === "error" && message && (
            <p className="mt-3 text-sm text-red-400">{message}</p>
          )}

          {/* Privacy Note */}
          <p className="mt-6 text-xs text-charcoal-500">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
