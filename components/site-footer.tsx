import Link from "next/link";

import { PageShell } from "@/components/page-shell";

export function SiteFooter() {
  return (
    <footer className="border-t bg-background" aria-label="Site footer">
      <PageShell className="py-6 text-center text-sm text-muted-foreground">
        <p>
          Copyright © 2026 Digital Health CRC <span aria-hidden="true">|</span>{" "}
          <Link
            href="https://digitalhealthcrc.com/privacy-policy/"
            className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary"
          >
            Privacy Policy
          </Link>
        </p>
      </PageShell>
    </footer>
  );
}
