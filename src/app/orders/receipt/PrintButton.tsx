"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function PrintButton() {
  return (
    <div className="mt-8 flex flex-wrap gap-4 print:hidden">
      <Button variant="primary" size="md" onClick={() => window.print()}>
        Print / Save as PDF
      </Button>
      <Link href="/orders">
        <Button variant="outline" size="md">
          Back to Orders
        </Button>
      </Link>
    </div>
  );
}
