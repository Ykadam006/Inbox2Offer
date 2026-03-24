import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:flex">
        <Sidebar user={session.user} />
      </div>
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="h-full">{children}</div>
      </main>
      <MobileNav />
    </div>
  );
}
