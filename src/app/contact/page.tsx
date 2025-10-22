"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

type ContactFormState = {
  fullName: string;
  email: string;
  company: string;
  message: string;
};

type ContactErrors = Partial<Record<keyof ContactFormState, string>>;

export default function ContactPage() {
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <NeuralBackdrop />
      <main className="relative z-10">
        <ContactSection />
      </main>
    </div>
  );
}

function ContactSection() {
  const [form, setForm] = useState<ContactFormState>({
    fullName: "",
    email: "",
    company: "",
    message: "",
  });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(id);
  }, [toast]);

  const infoBlocks = useMemo(
    () => [
      {
        icon: "📍",
        title: "Our Headquarters",
        lines: ["123 Tech Plaza, Innovation District", "Silicon Valley, CA 94025", "United States"],
      },
      {
        icon: "📞",
        title: "Sales & Support",
        lines: ["Sales: +1 (555) 123-4567 (M-F, 9am-5pm EST)", "Support: +1 (555) 123-4568 (Available 24/7)"],
      },
      {
        icon: "✉️",
        title: "Email",
        lines: ["General Inquiries: hello@trinix.com", "Technical Support: support@trinix.com"],
      },
    ],
    []
  );

  const emailRegex =
    /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|(?:\d{1,3}\.){3}\d{1,3})$/;

  const validate = (state: ContactFormState): ContactErrors => {
    const nextErrors: ContactErrors = {};
    if (!state.fullName.trim()) nextErrors.fullName = "This field is required";
    if (!state.email.trim()) {
      nextErrors.email = "This field is required";
    } else if (!emailRegex.test(state.email.trim())) {
      nextErrors.email = "Please enter a valid email address";
    }
    if (!state.message.trim()) nextErrors.message = "This field is required";
    return nextErrors;
  };

  const handleChange = (field: keyof ContactFormState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validate(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    try {
      setSubmitting(true);
      setToast(null);
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Request failed");
      setToast({ type: "success", message: "Thanks! We'll be in touch within 24 hours." });
      setForm({ fullName: "", email: "", company: "", message: "" });
    } catch (error) {
      console.error("[ContactPage] submit failed", error);
      setToast({ type: "error", message: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.section
      id="contact"
      className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-24"
      aria-labelledby="contact-heading"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
    >
      <div className="space-y-4">
  <p className="text-xs uppercase tracking-[0.35em] text-aurora-teal/80">Let&apos;s Connect</p>
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-xl">
            <h1 id="contact-heading" className="font-display text-3xl font-semibold text-white">
              Let&apos;s Connect
            </h1>
            <p className="mt-3 text-sm text-white/70">
              Ready to transform your business? Let&apos;s start a conversation about your next project and explore how our expertise can
              help you achieve your technological goals.
            </p>
            <div className="mt-8 space-y-6">
              {infoBlocks.map((block) => (
                <div key={block.title} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl shadow-lg">
                  <div className="text-2xl" aria-hidden="true">
                    {block.icon}
                  </div>
                  <h2 className="mt-3 text-lg font-semibold text-white">{block.title}</h2>
                  <ul className="mt-2 space-y-1 text-sm text-white/70">
                    {block.lines.map((line) => (
                      <li key={`${block.title}-${line}`}>{line}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-8 text-xs uppercase tracking-[0.25em] text-white/60">
              We aim to respond to all inquiries within 24 hours.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-xl">
            <h2 className="text-2xl font-semibold text-white">Send us a message</h2>
            <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
              {toast ? (
                <div
                  role="status"
                  aria-live={toast.type === "success" ? "polite" : "assertive"}
                  className=
                    {
                      toast.type === "success"
                        ? "rounded-md border border-aurora-teal/40 bg-aurora-teal/10 px-4 py-3 text-sm text-aurora-teal"
                        : "rounded-md border border-red-400/50 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                    }
                >
                  {toast.message}
                </div>
              ) : null}
              <div>
                <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
                  Full Name *
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  placeholder="Your full name"
                  value={form.fullName}
                  onChange={handleChange("fullName")}
                  className="mt-2 w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-aurora-teal/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-teal/60"
                  aria-invalid={errors.fullName ? "true" : "false"}
                  aria-describedby={errors.fullName ? "fullName-error" : undefined}
                />
                {errors.fullName ? (
                  <p id="fullName-error" className="mt-1 text-xs text-red-300">
                    {errors.fullName}
                  </p>
                ) : null}
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="your.email@company.com"
                  value={form.email}
                  onChange={handleChange("email")}
                  className="mt-2 w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-aurora-teal/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-teal/60"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email ? (
                  <p id="email-error" className="mt-1 text-xs text-red-300">
                    {errors.email}
                  </p>
                ) : null}
              </div>
              <div>
                <label htmlFor="company" className="block text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
                  Company (Optional)
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="Your company name"
                  value={form.company}
                  onChange={handleChange("company")}
                  className="mt-2 w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-aurora-teal/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-teal/60"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
                  Your Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  placeholder="Tell us about your project and how we can help..."
                  value={form.message}
                  onChange={handleChange("message")}
                  className="mt-2 w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-aurora-teal/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-teal/60"
                  aria-invalid={errors.message ? "true" : "false"}
                  aria-describedby={errors.message ? "message-error" : undefined}
                />
                {errors.message ? (
                  <p id="message-error" className="mt-1 text-xs text-red-300">
                    {errors.message}
                  </p>
                ) : null}
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-md border border-aurora-teal/60 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-teal/60 disabled:cursor-not-allowed disabled:border-white/20 disabled:text-white/60"
                  disabled={submitting}
                >
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function NeuralBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <motion.div
        className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_center,rgba(61,245,242,0.3),transparent_60%)] blur-3xl"
        animate={{ opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(120deg,rgba(63,60,216,0.15)_0%,transparent_40%,rgba(240,179,90,0.2)_100%)]"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
