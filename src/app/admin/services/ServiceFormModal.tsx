"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { ServiceFormData } from "./actions";

const ICON_OPTIONS = [
  "id-card",
  "shield",
  "credit-card",
  "vote",
  "car",
  "bank",
  "printer",
  "file-text",
  "heart",
  "shield-check",
  "award",
  "receipt",
];

type ServiceFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ServiceFormData & { id: string } | null;
  onSubmit: (form: ServiceFormData) => Promise<{ ok: true } | { ok: false; error: string }>;
  submitLabel: string;
};

const defaultForm: ServiceFormData = {
  title: "",
  description: "",
  icon: "receipt",
  category: "",
  isActive: true,
  price: "",
  processingTime: "",
  documentsRequiredText: "",
};

export function ServiceFormModal({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  submitLabel,
}: ServiceFormModalProps) {
  const [form, setForm] = useState<ServiceFormData>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        description: initialData.description,
        icon: initialData.icon,
        category: initialData.category,
        isActive: initialData.isActive,
        price: initialData.price ?? "",
        processingTime: initialData.processingTime ?? "",
        documentsRequiredText: initialData.documentsRequiredText ?? "",
      });
    } else {
      setForm(defaultForm);
    }
    setError("");
  }, [initialData, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const result = await onSubmit(form);
    setSaving(false);
    if (result.ok) {
      onClose();
      return;
    }
    setError(result.error);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60" onClick={onClose} aria-hidden />
      <div className="relative flex w-full max-w-3xl max-h-[85vh] flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-xl md:p-8">
        <div className="flex items-center justify-between shrink-0 pb-4">
          <h2 className="text-xl font-bold text-slate-900">
            {initialData ? "Edit Service" : "Add Service"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4 pr-1">
          <Input
            label="Title"
            required
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            placeholder="e.g. Aadhaar Update"
          />
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Description
            </label>
            <textarea
              className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Short description"
            />
          </div>
          <Input
            label="Price (optional, ₹)"
            type="number"
            min={0}
            step={1}
            value={form.price}
            onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
            placeholder="e.g. 150"
          />
          <Input
            label="Processing time (optional)"
            value={form.processingTime}
            onChange={(e) => setForm((p) => ({ ...p, processingTime: e.target.value }))}
            placeholder="e.g. 1–2 days, 7–25 days"
          />
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Documents required (optional, one per line)
            </label>
            <textarea
              className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              rows={4}
              value={form.documentsRequiredText}
              onChange={(e) => setForm((p) => ({ ...p, documentsRequiredText: e.target.value }))}
              placeholder="Aadhaar copy&#10;Update form&#10;Mobile OTP"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Icon
            </label>
            <select
              className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              value={form.icon}
              onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))}
            >
              {ICON_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Category (optional)"
            value={form.category}
            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            placeholder="e.g. Government"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
            />
            <span className="text-sm font-semibold text-slate-700">Active</span>
          </label>
          {error && (
            <p className="text-sm font-medium text-red-600" role="alert">
              {error}
            </p>
          )}
          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" disabled={saving} isLoading={saving}>
              {submitLabel}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
