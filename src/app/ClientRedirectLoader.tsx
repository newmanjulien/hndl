"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "../components/Loader"; // adjust path as needed

export default function ClientRedirectLoader() {
  const router = useRouter();

  useEffect(() => {
    // Redirect immediately
    router.push("/dashboard/agents");
  }, [router]);

  return <Loader size={60} />; // show full-screen loader
}
