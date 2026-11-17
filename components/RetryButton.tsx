"use client";

export function RetryButton({ label }: { label: string }) {
  return (
    <button type="button" className="mz-btn mz-btn--primary mz-btn--lg" onClick={() => window.location.reload()}>
      {label}
    </button>
  );
}
