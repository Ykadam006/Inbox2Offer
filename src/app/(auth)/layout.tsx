import Link from "next/link";
import { Zap } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/4 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-gradient-to-b from-violet-500/15 to-transparent blur-3xl" />
      </div>
      <Link href="/" className="mb-8 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-forest-800 to-forest-600">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-forest-800 to-forest-500 dark:from-forest-400 dark:to-forest-300 bg-clip-text text-transparent">
          ApplyVibe
        </span>
      </Link>
      {children}
    </div>
  );
}
