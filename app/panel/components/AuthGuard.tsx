"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Props {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let layoutFrame = 0;
    let revealFrame = 0;
    let cancelled = false;

    async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      layoutFrame = window.requestAnimationFrame(() => {
        // Let iOS Safari settle the visual viewport after the auth route transition.
        document.documentElement.getBoundingClientRect();
        revealFrame = window.requestAnimationFrame(() => {
          if (!cancelled) setLoading(false);
        });
      });
    }

    checkUser();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(layoutFrame);
      window.cancelAnimationFrame(revealFrame);
    };
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F5F0]">
        <div className="text-2xl font-semibold text-[#2D4739]">
          🌿 Sprawdzanie dostępu...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
