import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { auth } from "@/server/auth/core";

export default async function AdminLoginPage() {
  const session = await auth();
  if (session) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#02040a] px-6 py-16 text-white">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
