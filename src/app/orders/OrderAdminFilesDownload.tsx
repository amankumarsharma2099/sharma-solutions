"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { getOrderAdminFileDownloadUrl } from "./actions";

type AdminFile = { file_url: string; file_name: string | null };

export function OrderAdminFilesDownload({
  orderId,
  files,
}: {
  orderId: string;
  files: AdminFile[];
}) {
  const [loadingUrl, setLoadingUrl] = useState<string | null>(null);

  const handleDownload = async (filePath: string) => {
    setLoadingUrl(filePath);
    const result = await getOrderAdminFileDownloadUrl(orderId, filePath);
    setLoadingUrl(null);
    if (result.ok) {
      window.open(result.url, "_blank");
    }
  };

  if (files.length === 0) return null;

  return (
    <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
      <p className="text-sm font-semibold text-emerald-800">Completed documents</p>
      <p className="mt-0.5 text-xs text-emerald-700">
        Your processed files are ready. Click to download.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {files.map((f) => (
          <Button
            key={f.file_url}
            variant="outline"
            size="sm"
            onClick={() => handleDownload(f.file_url)}
            disabled={loadingUrl === f.file_url}
          >
            {loadingUrl === f.file_url ? "..." : "Download " + (f.file_name || "file")}
          </Button>
        ))}
      </div>
    </div>
  );
}
