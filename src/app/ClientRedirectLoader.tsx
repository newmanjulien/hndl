"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClientRedirectLoader() {
  const router = useRouter();

  useEffect(() => {
    // Redirect immediately
    router.push("/dashboard/agents");
  }, [router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="loader" />
    </div>
  );
}
