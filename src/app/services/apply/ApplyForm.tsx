"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { placeOrderWithDocuments } from "../actions";
import { Button } from "@/components/ui/Button";
import { ServiceIcon } from "@/components/icons/ServiceIcon";
import type { Service } from "@/types/service";

function isUuid(s: string): boolean {
  return s.length === 36 && /^[0-9a-f-]{36}$/i.test(s);
}

const ACCEPT = ".jpg,.jpeg,.png,.pdf";
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

function sanitizeFileName(name: string): string {
  return name.replace(/[/\\]/g, "_").replace(/\s+/g, "_");
}

export function ApplyForm({ service }: { service: Service }) {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const serviceIdForOrder = isUuid(service.id) ? service.id : null;

  const addFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles?.length) return;
    const valid: File[] = [];
    for (let i = 0; i < newFiles.length; i++) {
      const f = newFiles[i];
      const ext = f.name.split(".").pop()?.toLowerCase();
      const allowed = ["jpg", "jpeg", "png", "pdf"];
      if (!ext || !allowed.includes(ext)) {
        toast.error(`"${f.name}" is not allowed. Use .jpg, .jpeg, .png or .pdf`);
        continue;
      }
      if (f.size > MAX_SIZE_BYTES) {
        toast.error(`"${f.name}" is larger than 10MB`);
        continue;
      }
      valid.push(f);
    }
    setFiles((prev) => [...prev, ...valid]);
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in to submit.");
      router.push("/login?redirect=/services/apply?service=" + encodeURIComponent(service.id));
      return;
    }
    if (files.length === 0) {
      toast.error("Please upload at least one document.");
      return;
    }

    setUploading(true);
    const documentUrls: string[] = [];
    const slug = service.id;
    const timestamp = Date.now();

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const safeName = sanitizeFileName(file.name);
        const path = `${user.id}/${slug}/${timestamp}-${i}-${safeName}`;
        const { error } = await supabase.storage
          .from("order-documents")
          .upload(path, file, {
            contentType: file.type,
            upsert: false,
          });
        if (error) {
          console.error("Supabase Storage Error:", error);
          toast.error(error.message || "Upload failed. Please try again.");
          setUploading(false);
          return;
        }
        documentUrls.push(path);
      }

      setUploading(false);
      setSubmitting(true);

      const result = await placeOrderWithDocuments(
        service.title,
        service.price ?? null,
        documentUrls,
        serviceIdForOrder
      );

      if (!result.ok) {
        toast.error(result.error);
        setSubmitting(false);
        return;
      }

      toast.success("Order placed successfully!");
      router.push("/orders");
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Something went wrong");
      setUploading(false);
      setSubmitting(false);
    }
  };

  const isBusy = uploading || submitting;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Service detail card — same layout for all services; optional fields only when present */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 border border-blue-200">
            <ServiceIcon name={service.icon} className="h-8 w-8 text-blue-800" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-slate-900">{service.title}</h1>
            {service.price != null && !Number.isNaN(Number(service.price)) && (
              <p className="mt-1 text-lg font-semibold text-blue-700">
                ₹{Number(service.price)}
              </p>
            )}
            {service.processing_time && (
              <p className="mt-2 text-sm text-slate-600">
                Processing time: {service.processing_time}
              </p>
            )}
          </div>
        </div>
        <p className="mt-6 text-slate-600">{service.description}</p>
        {service.documents_required && service.documents_required.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-700">
              Documents required
            </h3>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-600">
              {service.documents_required.map((doc, i) => (
                <li key={i}>{doc}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Upload section */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">
        <h2 className="text-lg font-semibold text-slate-900">
          Upload Required Documents
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          JPG, JPEG, PNG or PDF. Max 10MB per file. Multiple files allowed.
        </p>

        <div
          className={`mt-4 rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
            dragActive
              ? "border-blue-500 bg-blue-50/50"
              : "border-slate-200 bg-slate-50/50 hover:border-slate-300"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            addFiles(e.dataTransfer.files);
          }}
        >
          <input
            type="file"
            accept={ACCEPT}
            multiple
            className="hidden"
            id="file-upload"
            onChange={(e) => addFiles(e.target.files)}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer text-slate-700 hover:text-blue-700"
          >
            <span className="block text-sm font-medium">
              Drag and drop files here, or click to browse
            </span>
          </label>
        </div>

        {files.length > 0 && (
          <ul className="mt-4 space-y-2">
            {files.map((file, i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-xl bg-slate-100 px-4 py-2 text-sm text-slate-800 border border-slate-200"
              >
                <span className="truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="ml-2 shrink-0 text-red-600 hover:underline"
                  aria-label="Remove file"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isBusy}
            disabled={files.length === 0 || isBusy}
            onClick={handleSubmit}
          >
            {uploading ? "Uploading..." : submitting ? "Submitting..." : "Submit Order"}
          </Button>
          <Link href="/services" className="block sm:flex-1">
            <Button variant="outline" size="lg" fullWidth disabled={isBusy}>
              Back to Services
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
