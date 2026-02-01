"use client";

import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/utils";

interface MinSideLayoutProps {
  children: React.ReactNode;
}

export default function MinSideLayout({ children }: MinSideLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: "/min-side", label: "Oversikt", icon: "" },
    { href: "/min-side/min-informasjon", label: "Min informasjon", icon: "" },
    { href: "/min-side/mine-katter", label: "Mine katter", icon: "" },
    { href: "/min-side/mine-bookinger", label: "Mine bookinger", icon: "" },
  ];

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50">
      {/* Header */}
      <header className="bg-white border-b border-orange-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🐈</span>
              <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Kattehotellet
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Logg ut
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="md:w-64 flex-shrink-0">
            <nav className="bg-white rounded-2xl shadow-lg p-4 border border-orange-100">
              <div className="space-y-2">
                {navItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/min-side" &&
                      pathname.startsWith(item.href));

                  return (
                    <button
                      key={item.href}
                      onClick={() => router.push(item.href)}
                      className={`
                        w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition
                        ${
                          isActive
                            ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md"
                            : "text-gray-700 hover:bg-orange-50"
                        }
                      `}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-white rounded-2xl shadow-lg p-8 border border-orange-100">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
