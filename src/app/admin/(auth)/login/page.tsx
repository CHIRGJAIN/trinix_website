import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#02040a] px-6 py-16 text-white">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
