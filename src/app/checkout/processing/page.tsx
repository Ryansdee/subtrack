"use client"; // si vous utilisez des hooks client

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ProcessingContent() {
  const searchParams = useSearchParams();
  const param = searchParams.get("votreParam");

  return <div>Paramètre reçu : {param}</div>;
}

export default function Page() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ProcessingContent />
    </Suspense>
  );
}
