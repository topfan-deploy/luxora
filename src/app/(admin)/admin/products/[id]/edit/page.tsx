"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Trash2, ImagePlus } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    compareAt: "",
    categoryId: "",
    stock: "0",
    sku: "",
    isActive: true,
    isFeatured: false,
    imageUrl: "",
  });

  const fetchProduct = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/products/${productId}`);
      const json = await res.json();
      if (json.success) {
        const p = json.data;
        setForm({
          name: p.name || "",
          description: p.description || "",
          price: p.price?.toString() || "",
          compareAt: p.compareAt?.toString() || "",
          categoryId: p.categoryId || "",
          stock: p.stock?.toString() || "0",
          sku: p.sku || "",
          isActive: p.isActive ?? true,
          isFeatured: p.isFeatured ?? false,
          imageUrl: p.images?.[0]?.url || "",
        });
      } else {
        setErrors({ _form: json.error || "Failed to load product" });
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
      setErrors({ _form: "Failed to load product" });
    } finally {
      setFetching(false);
    }
  }, [productId]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categories");
      const json = await res.json();
      if (json.success) {
        setCategories(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }, []);

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [fetchProduct, fetchCategories]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const body = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        compareAt: form.compareAt ? parseFloat(form.compareAt) : null,
        categoryId: form.categoryId,
        stock: parseInt(form.stock, 10),
        sku: form.sku || undefined,
        isActive: form.isActive,
        isFeatured: form.isFeatured,
        imageUrl: form.imageUrl || undefined,
      };

      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.errors) {
          const fieldErrors: Record<string, string> = {};
          for (const err of json.errors) {
            if (err.path?.[0]) {
              fieldErrors[err.path[0]] = err.message;
            }
          }
          setErrors(fieldErrors);
        } else {
          setErrors({ _form: json.error || "Failed to update product" });
        }
        return;
      }

      router.push("/admin/products");
    } catch (error) {
      console.error("Failed to update product:", error);
      setErrors({ _form: "An unexpected error occurred" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/admin/products");
      } else {
        const json = await res.json();
        alert(json.error || "Failed to delete product");
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  if (fetching) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="h-10 w-48 bg-charcoal-800 rounded animate-pulse" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-5"
          >
            <div className="h-6 w-32 bg-charcoal-800 rounded animate-pulse mb-4" />
            <div className="h-10 bg-charcoal-800 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 text-charcoal-400 hover:text-charcoal-100 hover:bg-charcoal-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-heading text-2xl text-charcoal-100">
              Edit Product
            </h1>
            <p className="text-charcoal-400 text-sm mt-1">{form.name}</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-red-500/30 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/10 transition-colors disabled:opacity-60"
        >
          {deleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
          Delete
        </button>
      </div>

      {/* Form Error */}
      {errors._form && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-300">
          {errors._form}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-5 space-y-4">
          <h2 className="font-heading text-lg text-charcoal-100">
            Basic Information
          </h2>

          <div>
            <label className="block text-sm font-medium text-charcoal-300 mb-1.5">
              Product Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Luxe Diamond Watch"
              className="w-full px-4 py-2.5 bg-charcoal-950 border border-charcoal-700 rounded-lg text-sm text-charcoal-100 placeholder:text-charcoal-500 focus:outline-none focus:border-gold-400/50 focus:ring-1 focus:ring-gold-400/20 transition-colors"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal-300 mb-1.5">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              placeholder="Describe your product..."
              className="w-full px-4 py-2.5 bg-charcoal-950 border border-charcoal-700 rounded-lg text-sm text-charcoal-100 placeholder:text-charcoal-500 focus:outline-none focus:border-gold-400/50 focus:ring-1 focus:ring-gold-400/20 transition-colors resize-none"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-400">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal-300 mb-1.5">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-charcoal-950 border border-charcoal-700 rounded-lg text-sm text-charcoal-100 focus:outline-none focus:border-gold-400/50 focus:ring-1 focus:ring-gold-400/20 transition-colors"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-xs text-red-400">{errors.categoryId}</p>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-5 space-y-4">
          <h2 className="font-heading text-lg text-charcoal-100">Pricing</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal-300 mb-1.5">
                Price (USD) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="0.00"
                className="w-full px-4 py-2.5 bg-charcoal-950 border border-charcoal-700 rounded-lg text-sm text-charcoal-100 placeholder:text-charcoal-500 focus:outline-none focus:border-gold-400/50 focus:ring-1 focus:ring-gold-400/20 transition-colors"
              />
              {errors.price && (
                <p className="mt-1 text-xs text-red-400">{errors.price}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-300 mb-1.5">
                Compare At Price
              </label>
              <input
                type="number"
                name="compareAt"
                value={form.compareAt}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="0.00"
                className="w-full px-4 py-2.5 bg-charcoal-950 border border-charcoal-700 rounded-lg text-sm text-charcoal-100 placeholder:text-charcoal-500 focus:outline-none focus:border-gold-400/50 focus:ring-1 focus:ring-gold-400/20 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-5 space-y-4">
          <h2 className="font-heading text-lg text-charcoal-100">Inventory</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal-300 mb-1.5">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2.5 bg-charcoal-950 border border-charcoal-700 rounded-lg text-sm text-charcoal-100 placeholder:text-charcoal-500 focus:outline-none focus:border-gold-400/50 focus:ring-1 focus:ring-gold-400/20 transition-colors"
              />
              {errors.stock && (
                <p className="mt-1 text-xs text-red-400">{errors.stock}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-300 mb-1.5">
                SKU
              </label>
              <input
                type="text"
                name="sku"
                value={form.sku}
                onChange={handleChange}
                placeholder="e.g. LX-WATCH-001"
                className="w-full px-4 py-2.5 bg-charcoal-950 border border-charcoal-700 rounded-lg text-sm text-charcoal-100 placeholder:text-charcoal-500 focus:outline-none focus:border-gold-400/50 focus:ring-1 focus:ring-gold-400/20 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-5 space-y-4">
          <h2 className="font-heading text-lg text-charcoal-100 flex items-center gap-2">
            <ImagePlus className="w-5 h-5 text-charcoal-400" />
            Product Image
          </h2>

          <div>
            <label className="block text-sm font-medium text-charcoal-300 mb-1.5">
              Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2.5 bg-charcoal-950 border border-charcoal-700 rounded-lg text-sm text-charcoal-100 placeholder:text-charcoal-500 focus:outline-none focus:border-gold-400/50 focus:ring-1 focus:ring-gold-400/20 transition-colors"
            />
          </div>

          {form.imageUrl && (
            <div className="w-32 h-32 rounded-lg border border-charcoal-700 overflow-hidden bg-charcoal-950">
              <img
                src={form.imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        {/* Toggles */}
        <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-5 space-y-4">
          <h2 className="font-heading text-lg text-charcoal-100">Visibility</h2>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="w-4 h-4 rounded border-charcoal-600 bg-charcoal-950 text-gold-400 focus:ring-gold-400/20 focus:ring-offset-0"
              />
              <div>
                <p className="text-sm font-medium text-charcoal-200">Active</p>
                <p className="text-xs text-charcoal-400">
                  Product is visible and available for purchase
                </p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 rounded border-charcoal-600 bg-charcoal-950 text-gold-400 focus:ring-gold-400/20 focus:ring-offset-0"
              />
              <div>
                <p className="text-sm font-medium text-charcoal-200">
                  Featured
                </p>
                <p className="text-xs text-charcoal-400">
                  Display on homepage and featured sections
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2.5 border border-charcoal-700 text-charcoal-300 rounded-lg text-sm font-medium hover:bg-charcoal-800 hover:border-charcoal-600 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gold-400 text-charcoal-950 rounded-lg text-sm font-semibold hover:bg-gold-300 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
}
