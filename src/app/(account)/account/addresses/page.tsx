"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  X,
  Star,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { addressSchema, type AddressInput } from "@/lib/validation/schemas";
import { cn } from "@/lib/utils/format";

type Address = {
  id: string;
  label: string | null;
  firstName: string;
  lastName: string;
  street: string;
  apartment: string | null;
  city: string;
  state: string | null;
  zipCode: string;
  country: string;
  phone: string | null;
  isDefault: boolean;
};

const emptyForm: AddressInput = {
  label: "",
  firstName: "",
  lastName: "",
  street: "",
  apartment: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  phone: "",
  isDefault: false,
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressInput>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    try {
      const res = await fetch("/api/account/addresses");
      if (!res.ok) throw new Error("Failed to fetch addresses");
      const data = await res.json();
      setAddresses(data.data);
    } catch {
      setApiError("Failed to load addresses. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
    setApiError(null);
    setShowModal(true);
  }

  function openEditModal(address: Address) {
    setEditingId(address.id);
    setForm({
      label: address.label || "",
      firstName: address.firstName,
      lastName: address.lastName,
      street: address.street,
      apartment: address.apartment || "",
      city: address.city,
      state: address.state || "",
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone || "",
      isDefault: address.isDefault,
    });
    setErrors({});
    setApiError(null);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
  }

  function updateField(field: keyof AddressInput, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError(null);

    const result = addressSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0];
        if (field) fieldErrors[String(field)] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSaving(true);
    try {
      const url = editingId
        ? `/api/account/addresses/${editingId}`
        : "/api/account/addresses";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save address");
      }

      await fetchAddresses();
      closeModal();
    } catch (err) {
      setApiError(
        err instanceof Error ? err.message : "Failed to save address"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this address?")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/account/addresses/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete address");
      }
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setApiError(
        err instanceof Error ? err.message : "Failed to delete address"
      );
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 text-gold-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl text-charcoal-100">
            Addresses
          </h1>
          <p className="text-charcoal-400 font-body mt-1">
            Manage your shipping addresses.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold-400 text-charcoal-950 font-body font-semibold rounded-lg hover:bg-gold-300 transition-colors text-sm"
        >
          <Plus className="h-4 w-4" />
          Add Address
        </button>
      </div>

      {/* API Error */}
      {apiError && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
          <p className="text-red-300 font-body text-sm">{apiError}</p>
        </div>
      )}

      {/* Address Cards */}
      {addresses.length === 0 ? (
        <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl flex flex-col items-center justify-center py-20 px-6 text-center">
          <MapPin className="h-16 w-16 text-charcoal-600 mb-6" />
          <h2 className="text-charcoal-200 font-heading text-xl mb-2">
            No addresses saved
          </h2>
          <p className="text-charcoal-400 font-body text-sm mb-8 max-w-sm">
            Add a shipping address to speed up your checkout experience.
          </p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold-400 text-charcoal-950 font-body font-semibold rounded-lg hover:bg-gold-300 transition-colors text-sm"
          >
            <Plus className="h-4 w-4" />
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={cn(
                "bg-charcoal-900 border rounded-xl p-5 relative group",
                address.isDefault
                  ? "border-gold-400/50"
                  : "border-charcoal-700"
              )}
            >
              {/* Default Badge */}
              {address.isDefault && (
                <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 bg-gold-400/10 border border-gold-400/30 rounded-full">
                  <Star className="h-3 w-3 text-gold-400 fill-gold-400" />
                  <span className="text-gold-400 font-body text-xs font-semibold">
                    Default
                  </span>
                </div>
              )}

              {/* Label */}
              {address.label && (
                <p className="text-charcoal-400 font-body text-xs uppercase tracking-wider mb-2">
                  {address.label}
                </p>
              )}

              {/* Address Details */}
              <div className="font-body text-sm text-charcoal-300 space-y-1 pr-24">
                <p className="text-charcoal-100 font-medium">
                  {address.firstName} {address.lastName}
                </p>
                <p>{address.street}</p>
                {address.apartment && <p>{address.apartment}</p>}
                <p>
                  {address.city}
                  {address.state && `, ${address.state}`} {address.zipCode}
                </p>
                <p>{address.country}</p>
                {address.phone && (
                  <p className="text-charcoal-400 mt-1">{address.phone}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-charcoal-700/50">
                <button
                  onClick={() => openEditModal(address)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-charcoal-300 hover:text-gold-400 hover:bg-charcoal-800 rounded-lg transition-colors font-body text-sm"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  disabled={deleting === address.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-charcoal-300 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors font-body text-sm disabled:opacity-50"
                >
                  {deleting === address.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-charcoal-950/80 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal Content */}
          <div className="relative bg-charcoal-900 border border-charcoal-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-charcoal-900 border-b border-charcoal-700 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="font-heading text-lg text-charcoal-100">
                {editingId ? "Edit Address" : "Add New Address"}
              </h2>
              <button
                onClick={closeModal}
                className="text-charcoal-400 hover:text-charcoal-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {apiError && (
                <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                  <p className="text-red-300 font-body text-sm">{apiError}</p>
                </div>
              )}

              {/* Label */}
              <FormField
                label="Label (optional)"
                value={form.label || ""}
                onChange={(v) => updateField("label", v)}
                placeholder="e.g., Home, Office"
                error={errors.label}
              />

              {/* Name Row */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="First Name"
                  value={form.firstName}
                  onChange={(v) => updateField("firstName", v)}
                  error={errors.firstName}
                  required
                />
                <FormField
                  label="Last Name"
                  value={form.lastName}
                  onChange={(v) => updateField("lastName", v)}
                  error={errors.lastName}
                  required
                />
              </div>

              {/* Street */}
              <FormField
                label="Street Address"
                value={form.street}
                onChange={(v) => updateField("street", v)}
                error={errors.street}
                required
              />

              {/* Apartment */}
              <FormField
                label="Apartment, suite, etc. (optional)"
                value={form.apartment || ""}
                onChange={(v) => updateField("apartment", v)}
                error={errors.apartment}
              />

              {/* City & State */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="City"
                  value={form.city}
                  onChange={(v) => updateField("city", v)}
                  error={errors.city}
                  required
                />
                <FormField
                  label="State / Province"
                  value={form.state || ""}
                  onChange={(v) => updateField("state", v)}
                  error={errors.state}
                />
              </div>

              {/* ZIP & Country */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="ZIP / Postal Code"
                  value={form.zipCode}
                  onChange={(v) => updateField("zipCode", v)}
                  error={errors.zipCode}
                  required
                />
                <FormField
                  label="Country"
                  value={form.country}
                  onChange={(v) => updateField("country", v)}
                  error={errors.country}
                  required
                />
              </div>

              {/* Phone */}
              <FormField
                label="Phone (optional)"
                value={form.phone || ""}
                onChange={(v) => updateField("phone", v)}
                error={errors.phone}
                type="tel"
              />

              {/* Default Checkbox */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={form.isDefault || false}
                  onChange={(e) => updateField("isDefault", e.target.checked)}
                  className="h-4 w-4 rounded border-charcoal-600 bg-charcoal-800 text-gold-400 focus:ring-gold-400/50 focus:ring-offset-charcoal-900"
                />
                <span className="text-charcoal-300 font-body text-sm group-hover:text-charcoal-200 transition-colors">
                  Set as default address
                </span>
              </label>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold-400 text-charcoal-950 font-body font-semibold rounded-lg hover:bg-gold-300 transition-colors text-sm disabled:opacity-70 disabled:cursor-wait"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingId ? "Update Address" : "Save Address"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 text-charcoal-300 hover:text-charcoal-100 font-body text-sm rounded-lg border border-charcoal-700 hover:border-charcoal-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-charcoal-200 mb-1.5 font-body">
        {label}
        {required && <span className="text-gold-400 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full px-4 py-2.5 bg-charcoal-800 border rounded-lg text-charcoal-100 placeholder-charcoal-500 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400/50 transition-colors",
          error ? "border-red-500" : "border-charcoal-700"
        )}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400 font-body">{error}</p>
      )}
    </div>
  );
}
