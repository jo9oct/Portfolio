import {
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import { FaGithub, FaLinkedin, FaYoutube } from "react-icons/fa";

import { useState, type FormEvent } from "react";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import axios from "axios";

import { Section } from "@/components/subSection/Section";
import { profile } from "@/lib/portfolio-data";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3422";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ FIXED INPUT HANDLER
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ RELIABLE CONTACT SEND (Telegram + EmailJS Dual Delivery)
  const sendEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }

    setIsSubmitting(true);

    try {
      const templateParams = {
        name: formData.name.trim(),
        from_name: formData.name.trim(),
        user_name: formData.name.trim(),

        email: formData.email.trim(),
        from_email: formData.email.trim(),
        user_email: formData.email.trim(),
        reply_to: formData.email.trim(),

        subject: formData.subject.trim() || "New message from Portfolio",
        message: formData.message.trim(),

        to_name: profile.name,
        to_email: profile.email,
        recipient: profile.email,
      };

      let emailSuccess = false;
      let telegramSuccess = false;
      let emailErrorMessage = "";

      // 1. Send via EmailJS with full parameter coverage
      try {
        const emailResult = await emailjs.send(
          "coder<jo>",
          "template_iy8btmr",
          templateParams,
          "8ws9zrwgVR9zxfAKp"
        );
        if (emailResult.status === 200 || emailResult.text === "OK") {
          emailSuccess = true;
        }
      } catch (err: unknown) {
        console.error("EmailJS Error:", err);
        emailErrorMessage = (err as { text?: string; message?: string })?.text || (err as Error)?.message || "";
      }

      // 2. Send via Backend Telegram
      try {
        const tgRes = await axios.post(`${backendUrl}/telegram/send`, {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          text: formData.message,
        });
        if (tgRes.data?.ok) {
          telegramSuccess = true;
        }
      } catch (tgErr) {
        console.error("Telegram Error:", tgErr);
      }

      if (emailSuccess && telegramSuccess) {
        toast.success("Message sent successfully to Email & Telegram!");
      } else if (emailSuccess) {
        toast.success("Message sent to Email successfully!");
      } else if (telegramSuccess) {
        if (emailErrorMessage) {
          toast.success("Message delivered to Telegram! (Email notification pending)", { duration: 5000 });
        } else {
          toast.success("Message sent — I'll reply soon.");
        }
      } else {
        throw new Error(emailErrorMessage || "Failed to deliver message. Please contact via Telegram or email directly.");
      }

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error: unknown) {
      const msg = (error as { text?: string; message?: string })?.message || (error as { text?: string })?.text || "Failed to send message";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section id="contact" eyebrow="04 — Contact" title="Get in touch">
      <div className="grid gap-10 md:grid-cols-2">

        {/* FORM */}
        <form onSubmit={sendEmail} className="space-y-3">

          <input
            className="input"
            placeholder="Your name"
            name="name"  
            value={formData.name}
            onChange={handleInputChange}
            maxLength={80}
          />

          <input
            className="input"
            type="email"
            placeholder="Email"
            name="email"  
            value={formData.email}
            onChange={handleInputChange}
            maxLength={120}
          />

          <input
            className="input"
            placeholder="Subject"
            name="subject" 
            value={formData.subject}
            onChange={handleInputChange}
            maxLength={120}
          />

          <textarea
            className="input min-h-[120px] resize-y"
            placeholder="Your message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            maxLength={2000}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-simple w-full justify-center"
          >
            {isSubmitting ? (
              "Sending…"
            ) : (
              <>
                Send message <Send className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* INFO SIDE (UNCHANGED) */}
        <div className="space-y-6 text-sm">
          <p className="text-muted-foreground leading-relaxed">
            I'm always excited to work on new projects. Feel free to reach out below or use the chat on the right — messages go straight to my Telegram.
          </p>

          <div className="space-y-4">
            <ContactLine icon={<Mail className="h-4 w-4" />} label="Email">
              <a href={`mailto:${profile.email}`} className="hover:text-foreground">
                {profile.email}
              </a>
            </ContactLine>

            <ContactLine icon={<Phone className="h-4 w-4" />} label="Phone">
              <a href={`tel:${profile.phone}`} className="hover:text-foreground">
                {profile.phone}
              </a>
            </ContactLine>

            <ContactLine icon={<MapPin className="h-4 w-4" />} label="Location">
              {profile.location}
            </ContactLine>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <SocialIcon href={profile.github} label="GitHub">
              <FaGithub className="h-4 w-4" />
            </SocialIcon>

            <SocialIcon href={profile.linkedin} label="LinkedIn">
              <FaLinkedin className="h-4 w-4" />
            </SocialIcon>

            <SocialIcon href={profile.telegram} label="Telegram">
              <Send className="h-4 w-4" />
            </SocialIcon>

            <SocialIcon href={profile.youtube} label="YouTube">
              <FaYoutube className="h-4 w-4" />
            </SocialIcon>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------------- helpers unchanged ---------------- */

function ContactLine({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider">
        {icon} {label}
      </div>
      <div className="text-foreground text-sm pl-6">{children}</div>
    </div>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-border text-foreground hover:bg-accent transition"
    >
      {children}
    </a>
  );
}