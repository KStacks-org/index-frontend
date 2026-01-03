import React, { useEffect, useRef, useState } from "react";

function BootLoader() {
  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-black text-white">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        <span className="text-lg text-white/80">Indexing…</span>
      </div>
    </div>
  );
}

export function BootGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  // Prevent StrictMode double-run in dev from doing weird stuff
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    let cancelled = false;

    (async () => {
      // Wait for fonts (prevents "Inter pop-in")
      try {
        if (document.fonts?.ready) await document.fonts.ready;
      } catch {}

      // Wait for full page load (images/css/etc)
      await new Promise<void>((res) => {
        if (document.readyState === "complete") return res();
        window.addEventListener("load", () => res(), { once: true });
      });

      // Let layout settle for 2 frames
      await new Promise<void>((r) =>
        requestAnimationFrame(() => requestAnimationFrame(() => r()))
      );

      if (!cancelled) setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) return <BootLoader />;
  return <>{children}</>;
}
