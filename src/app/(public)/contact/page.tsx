"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Loader2,
  CheckCircle,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";
import { cn } from "@/lib/utils/format";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "support@luxora.com",
    href: "mailto:support@luxora.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (555) 123-4567",
    href: "tel:+15551234567",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "123 Commerce Street, Suite 400\nSan Francisco, CA 94102",
    href: null,
  },
  {
    icon: Clock,
    label: "Business Hours",
    value: "Mon - Fri: 9:00 AM - 6:00 PM (PST)\nSat - Sun: 10:00 AM - 4:00 PM (PST)",
    href: null,
  },
];

const socialLinks = [
  { name: "Facebook", href: "https://facebook.com", icon: Facebook },
  { name: "Instagram", href: "https://instagram.com", icon: Instagram },
  { name: "Twitter", href: "https://twitter.com", icon: Twitter },
  { name: "YouTube", href: "https://youtube.com", icon: Youtube },
];

const subjectOptions = [
  "General Inquiry",
  "Order Support",
  "Product Question",
  "Shipping & Delivery",
  "Returns & Refunds",
  "Technical Issue",
  "Partnership Inquiry",
  "Other",
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Please enter a valid email address.";
      }
    }

    if (!formData.subject) {
      newErrors.subject = "Please select a subject.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setStatus("loading");

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus("success");
  };

  if (status === "success") {
    return (
      <>
        <Header />
        <main className="min-h-screen">
          <section className="py-24 lg:py-36">
            <div className="container mx-auto px-4">
              <div className="max-w-lg mx-auto text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-400/10 mb-6">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
                <h1 className="font-heading text-3xl font-bold text-charcoal-100 mb-4">
                  Message Sent!
                </h1>
                <p className="text-charcoal-300 mb-8">
                  Thank you for reaching out to us. We have received your message
                  and will get back to you within 24-48 business hours.
                </p>
                <a href="/contact" className="btn-primary inline-flex items-center gap-2">
                  Send Another Message
                </a>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-charcoal-950 via-charcoal-900 to-charcoal-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(217,154,43,0.06)_0%,_transparent_70%)]" />
          <div className="relative container mx-auto px-4 text-center">
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-charcoal-100">
              Get in <span className="gold-text">Touch</span>
            </h1>
            <p className="mt-4 text-charcoal-300 max-w-xl mx-auto">
              Have a question, suggestion, or need help? We would love to hear
              from you. Reach out and our team will respond promptly.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 lg:py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-6 lg:p-8">
                  <h2 className="font-heading text-2xl font-bold text-charcoal-100 mb-6">
                    Send Us a Message
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-charcoal-200 mb-1.5"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className={cn(
                          "input-field",
                          errors.name && "border-red-500 focus:border-red-500 focus:ring-red-500"
                        )}
                        disabled={status === "loading"}
                      />
                      {errors.name && (
                        <p className="mt-1.5 text-sm text-red-400">{errors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-charcoal-200 mb-1.5"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className={cn(
                          "input-field",
                          errors.email && "border-red-500 focus:border-red-500 focus:ring-red-500"
                        )}
                        disabled={status === "loading"}
                      />
                      {errors.email && (
                        <p className="mt-1.5 text-sm text-red-400">{errors.email}</p>
                      )}
                    </div>

                    {/* Subject */}
                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-charcoal-200 mb-1.5"
                      >
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={cn(
                          "input-field",
                          !formData.subject && "text-charcoal-400",
                          errors.subject && "border-red-500 focus:border-red-500 focus:ring-red-500"
                        )}
                        disabled={status === "loading"}
                      >
                        <option value="" disabled>
                          Select a subject
                        </option>
                        {subjectOptions.map((option) => (
                          <option key={option} value={option} className="text-charcoal-100 bg-charcoal-800">
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors.subject && (
                        <p className="mt-1.5 text-sm text-red-400">{errors.subject}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-charcoal-200 mb-1.5"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help..."
                        rows={6}
                        className={cn(
                          "input-field resize-none",
                          errors.message && "border-red-500 focus:border-red-500 focus:ring-red-500"
                        )}
                        disabled={status === "loading"}
                      />
                      {errors.message && (
                        <p className="mt-1.5 text-sm text-red-400">{errors.message}</p>
                      )}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-6">
                  <h3 className="font-heading text-lg font-semibold text-charcoal-100 mb-5">
                    Contact Information
                  </h3>
                  <div className="space-y-5">
                    {contactInfo.map((info) => {
                      const IconComponent = info.icon;
                      return (
                        <div key={info.label} className="flex items-start gap-3">
                          <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-charcoal-800">
                            <IconComponent className="h-4 w-4 text-gold-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-charcoal-200">
                              {info.label}
                            </p>
                            {info.href ? (
                              <a
                                href={info.href}
                                className="text-sm text-charcoal-400 hover:text-gold-400 transition-colors"
                              >
                                {info.value}
                              </a>
                            ) : (
                              <p className="text-sm text-charcoal-400 whitespace-pre-line">
                                {info.value}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Social Links */}
                <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-6">
                  <h3 className="font-heading text-lg font-semibold text-charcoal-100 mb-4">
                    Follow Us
                  </h3>
                  <p className="text-sm text-charcoal-400 mb-4">
                    Stay connected for the latest updates, promotions, and community highlights.
                  </p>
                  <div className="flex items-center gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-10 w-10 flex items-center justify-center rounded-lg bg-charcoal-800 text-charcoal-300 hover:bg-gold-400 hover:text-charcoal-950 transition-colors duration-200"
                        aria-label={`Follow us on ${social.name}`}
                      >
                        <social.icon className="h-4 w-4" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Quick Links */}
                <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-6">
                  <h3 className="font-heading text-lg font-semibold text-charcoal-100 mb-4">
                    Quick Links
                  </h3>
                  <div className="space-y-2">
                    <a
                      href="/faq"
                      className="block text-sm text-charcoal-300 hover:text-gold-400 transition-colors"
                    >
                      Frequently Asked Questions
                    </a>
                    <a
                      href="/shipping"
                      className="block text-sm text-charcoal-300 hover:text-gold-400 transition-colors"
                    >
                      Shipping Information
                    </a>
                    <a
                      href="/returns"
                      className="block text-sm text-charcoal-300 hover:text-gold-400 transition-colors"
                    >
                      Returns & Refunds
                    </a>
                    <a
                      href="/privacy"
                      className="block text-sm text-charcoal-300 hover:text-gold-400 transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
