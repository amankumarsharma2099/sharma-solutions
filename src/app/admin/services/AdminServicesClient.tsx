"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ServiceFormModal } from "./ServiceFormModal";
import type { ServiceFormData } from "./actions";

type ServiceRow = {
  id: string;
  name: string | null;
  title?: string | null;
  description?: string | null;
  icon?: string | null;
  category?: string | null;
  is_active?: boolean | null;
  price?: number | null;
  processing_time?: string | null;
  documents_required?: string[] | null;
  created_at?: string | null;
};

type AdminServicesClientProps = {
  initialServices: ServiceRow[];
  onCreateService: (form: ServiceFormData) => Promise<{ ok: true } | { ok: false; error: string }>;
  onUpdateService: (id: string, form: ServiceFormData) => Promise<{ ok: true } | { ok: false; error: string }>;
  onDeleteService: (id: string) => Promise<{ ok: true } | { ok: false; error: string }>;
};

export function AdminServicesClient({
  initialServices,
  onCreateService,
  onUpdateService,
  onDeleteService,
}: AdminServicesClientProps) {
  const [services, setServices] = useState<ServiceRow[]>(initialServices);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ServiceRow | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const refresh = () => {
    window.location.reload();
  };

  const handleCreate = async (form: ServiceFormData) => {
    const result = await onCreateService(form);
    if (result.ok) {
      toast.success("Service created");
      refresh();
      return result;
    }
    return result;
  };

  const handleUpdate = async (form: ServiceFormData) => {
    if (!editing) return { ok: false as const, error: "No service selected" };
    const result = await onUpdateService(editing.id, form);
    if (result.ok) {
      toast.success("Service updated");
      setEditing(null);
      refresh();
      return result;
    }
    return result;
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service? This cannot be undone.")) return;
    setDeletingId(id);
    const result = await onDeleteService(id);
    setDeletingId(null);
    if (result.ok) {
      toast.success("Service deleted");
      refresh();
    } else {
      toast.error(result.error ?? "Something went wrong");
    }
  };

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (s: ServiceRow) => {
    setEditing(s);
    setModalOpen(true);
  };

  return (
    <>
      <div className="mt-6 flex justify-end">
        <Button variant="primary" onClick={openAdd}>
          Add Service
        </Button>
      </div>

      {services.length === 0 ? (
        <Card className="mt-6">
          <CardContent className="py-12 text-center">
            <p className="text-slate-600">No services yet. Add one to get started.</p>
            <Button variant="primary" className="mt-4" onClick={openAdd}>
              Add Service
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-sm font-semibold text-slate-700">Title</th>
                <th className="hidden px-4 py-3 text-sm font-semibold text-slate-700 sm:table-cell">Description</th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-700">Status</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} className="border-b border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {(s.title ?? s.name) || "—"}
                  </td>
                  <td className="hidden max-w-xs truncate px-4 py-3 text-sm text-slate-600 sm:table-cell">
                    {s.description || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                        s.is_active !== false
                          ? "bg-green-100 text-green-800 border-green-300"
                          : "bg-slate-100 text-slate-700 border-slate-300"
                      }`}
                    >
                      {s.is_active !== false ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(s)}>
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(s.id)}
                        disabled={deletingId === s.id}
                      >
                        {deletingId === s.id ? "..." : "Delete"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ServiceFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        initialData={
          editing
            ? {
                id: editing.id,
                title: (editing.title ?? editing.name) ?? "",
                description: editing.description ?? "",
                icon: editing.icon ?? "receipt",
                category: editing.category ?? "",
                isActive: editing.is_active !== false,
                price: editing.price != null ? String(editing.price) : "",
                processingTime: editing.processing_time ?? "",
                documentsRequiredText: Array.isArray(editing.documents_required)
                  ? editing.documents_required.join("\n")
                  : "",
              }
            : null
        }
        onSubmit={editing ? handleUpdate : handleCreate}
        submitLabel={editing ? "Save changes" : "Create service"}
      />
    </>
  );
}
