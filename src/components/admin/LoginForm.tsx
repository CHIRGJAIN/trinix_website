'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_VALUE } from '@/constants/adminSession';

const HARDCODED_EMAIL = 'admin@trinix.dev';
const HARDCODED_PASSWORD = 'letmein';

const formSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values: z.infer<typeof formSchema>) => {
    const emailMatches = values.email.trim().toLowerCase() === HARDCODED_EMAIL;
    const passwordMatches = values.password === HARDCODED_PASSWORD;

    if (!emailMatches || !passwordMatches) {
      setError('password', { type: 'manual', message: 'Invalid email or password' });
      return;
    }

  document.cookie = `${ADMIN_SESSION_COOKIE}=${ADMIN_SESSION_VALUE}; path=/; max-age=${60 * 60 * 8}`;
    router.push('/admin');
  });

  return (
    <form
      onSubmit={onSubmit}
      className="w-full space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 text-white backdrop-blur-xl"
    >
      <div className="space-y-2 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-aurora-teal/70">Restricted</p>
        <h1 className="font-display text-3xl font-semibold">Trinix Admin Access</h1>
        <p className="text-sm text-white/60">Sign in with your assigned admin credentials.</p>
      </div>

      <label className="block text-left text-sm">
        <span className="text-xs uppercase tracking-[0.25em] text-white/60">Email</span>
        <input
          type="email"
          autoComplete="email"
          className="mt-2 w-full rounded-xl border border-white/15 bg-[#05060a]/60 px-4 py-3 text-white focus:border-aurora-teal/60 focus:outline-none focus:ring-2 focus:ring-aurora-teal/60"
          {...register('email')}
        />
        {errors.email ? <p className="mt-2 text-xs text-copper-gold">{errors.email.message}</p> : null}
      </label>

      <label className="block text-left text-sm">
        <span className="text-xs uppercase tracking-[0.25em] text-white/60">Password</span>
        <input
          type="password"
          autoComplete="current-password"
          className="mt-2 w-full rounded-xl border border-white/15 bg-[#05060a]/60 px-4 py-3 text-white focus:border-aurora-teal/60 focus:outline-none focus:ring-2 focus:ring-aurora-teal/60"
          {...register('password')}
        />
        {errors.password ? <p className="mt-2 text-xs text-copper-gold">{errors.password.message}</p> : null}
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full border border-aurora-teal/60 bg-aurora-teal/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
