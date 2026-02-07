import { LogoutButton } from "@/components/logout-button";
import Link from "next/link";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-8 shadow-lg mt-14 rounded-lg bg-gray-100">
      <div className="flex items-center justify-between mb-8">
        <Link href="/minside">
          <h1 className="text-2xl font-bold mb-4">Min Side</h1>
        </Link>
        <LogoutButton />
      </div>
      {children}
    </div>
  );
};
export default Layout;
