"use client";
import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { Icon } from "@/components/icons/Icon";
import { SmartLink } from "./SmartLink";
import type { SectionProps } from "./types";

const EMAILJS = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "",
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "",
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "",
};

const inputClass =
  "w-full p-3 rounded-lg bg-black/20 border border-transparent focus:border-primary focus:ring-primary outline-none transition";

export const Contacts = ({ view }: SectionProps) => {
  const t = view.texts.contacts;
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.current) return;
    setStatus("sending");

    emailjs.sendForm(EMAILJS.serviceId, EMAILJS.templateId, form.current, EMAILJS.publicKey).then(
      () => {
        setStatus("success");
        form.current?.reset();
        setTimeout(() => setStatus("idle"), 3000);
      },
      () => {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      },
    );
  };

  const buttonClasses = {
    sending: "bg-gray-500 border-gray-400 text-foreground cursor-not-allowed",
    success: "bg-green-500 border-green-500 text-green-100",
    error: "bg-red-500 border-red-500 text-red-100",
    idle: "border border-foreground/40 text-white hover:bg-foreground/40 cursor-pointer",
  }[status];
  const buttonLabel = { sending: t.sendingLabel, success: t.successLabel, error: t.errorLabel, idle: t.submitLabel }[status];

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.heading}</h2>
      {t.tagline && <p className="mb-8 text-foreground/80">{t.tagline}</p>}

      <form ref={form} onSubmit={sendEmail} className="w-full p-8 space-y-6 rounded-xl glass-effect">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input type="text" name="name" placeholder={t.namePlaceholder} required className={inputClass} />
          <input type="email" name="email" placeholder={t.emailPlaceholder} required className={inputClass} />
        </div>
        <textarea name="message" placeholder={t.messagePlaceholder} rows={5} required className={inputClass}></textarea>

        <button
          type="submit"
          disabled={status === "sending"}
          className={`w-full py-3 text-lg font-semibold rounded-md transition-all duration-300 ${buttonClasses}`}
        >
          {buttonLabel}
        </button>
      </form>

      {view.socialLinks.length > 0 && (
        <div className="mt-12">
          <p className="mb-4 text-foreground/70">{t.socialHeading}</p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {view.socialLinks.map((link, i) => (
              <SmartLink
                key={i}
                href={link.url}
                className={`flex items-center gap-2 text-foreground/80 transition-colors ${link.url ? "hover:text-primary" : ""}`}
              >
                <Icon icon={link.icon} size={28} />
                <span className="font-medium">{link.label}</span>
              </SmartLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
