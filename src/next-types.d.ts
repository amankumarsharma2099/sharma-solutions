// Shim for Next.js generated validator types
declare module "next/types.js" {
  import type { Metadata, Viewport } from "next";
  export type ResolvingMetadata = (parent: Metadata) => Promise<Metadata>;
  export type ResolvingViewport = (parent: Viewport) => Promise<Viewport>;
}
