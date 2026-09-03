"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

function ContactFormContent() {
  const searchParams = useSearchParams();
  const initialService = searchParams.get("service") || "";

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: initialService || "Architectural Planning",
    details: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastActionType, setLastActionType] = useState<"whatsapp" | "email">("whatsapp");
  const [whatsappRedirectUrl, setWhatsappRedirectUrl] = useState("");
  const [emailRedirectUrl, setEmailRedirectUrl] = useState("");

  const handleSend = async (type: "whatsapp" | "email", e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("Please fill in your name and phone number.");
      return;
    }

    setIsSubmitting(true);
    setLastActionType(type);

    // Format message text
    const messageText =
      `*New Construction Enquiry - KRV Builders*\n\n` +
      `👤 *Name:* ${formData.name}\n` +
      `📞 *Phone:* ${formData.phone}\n` +
      `✉️ *Email:* ${formData.email || "Not provided"}\n` +
      `🏗️ *Service:* ${formData.service}\n` +
      `📝 *Details:* ${formData.details || "No additional details"}`;

    const formattedMessage = encodeURIComponent(messageText);

    // WhatsApp URL
    const targetWhatsappUrl = `https://wa.me/918217045680?text=${formattedMessage}`;

    // Gmail Web Composer URL + mailto fallback
    const subject = encodeURIComponent(`New Construction Enquiry from ${formData.name}`);
    const emailBody = encodeURIComponent(
      `New Construction Enquiry - KRV Builders\n\n` +
        `Name: ${formData.name}\n` +
        `Phone: ${formData.phone}\n` +
        `Email: ${formData.email || "Not provided"}\n` +
        `Service: ${formData.service}\n` +
        `Details: ${formData.details || "No additional details"}`
    );
    const targetGmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=krvbuildersndevelopers@gmail.com&su=${subject}&body=${emailBody}`;

    setWhatsappRedirectUrl(targetWhatsappUrl);
    setEmailRedirectUrl(targetGmailUrl);

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } catch (err) {
      console.error("Form submission logging error:", err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);

      // Open selected application
      if (typeof window !== "undefined") {
        if (type === "whatsapp") {
          window.open(targetWhatsappUrl, "_blank");
        } else {
          window.open(targetGmailUrl, "_blank");
        }
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
      {/* Contact Metadata & Info Cards */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Get in Touch</h2>

        {/* Head Office Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-bold text-slate-900">Head Office</h3>
              <a
                href="https://www.google.com/maps/search/?api=1&query=1st+Floor,+Above+Canara+Bank+ATM,+Moti+Nagar+Extension,+Ramanagara,+Karnataka+562159"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 transition flex items-center gap-1 shrink-0"
              >
                <span>Open Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mt-1 font-medium">
              1st Floor, Above Canara Bank ATM, Moti Nagar Extension, Ramanagara, Karnataka 562159
            </p>
          </div>
        </div>

        {/* Phone Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Phone & Mobile</h3>
            <div className="flex flex-col gap-1 mt-1 text-sm text-slate-700 font-semibold">
              <a href="tel:+918217045680" className="hover:text-amber-600 transition">
                +91 8217045680
              </a>
              <a href="tel:+918123758878" className="hover:text-amber-600 transition">
                +91 8123758878
              </a>
            </div>
          </div>
        </div>

        {/* Email & Hours */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Email & Schedule</h3>
            <a
              href="mailto:krvbuildersndevelopers@gmail.com"
              className="text-xs sm:text-sm text-amber-600 hover:underline mt-1 block truncate font-semibold"
            >
              krvbuildersndevelopers@gmail.com
            </a>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Mon-Fri 9:00 AM – 8:00 PM (Sat-Sun Appt)
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-3">
          <a
            href="https://wa.me/918217045680"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-emerald-800 hover:bg-emerald-100 transition shadow-sm"
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 fill-emerald-600/20 text-emerald-600" />
              <div className="text-sm font-bold text-slate-900">WhatsApp (+91 8217045680)</div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-700" />
          </a>

          <a
            href="mailto:krvbuildersndevelopers@gmail.com"
            className="p-4 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-between text-slate-900 hover:bg-slate-200 transition shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-amber-600" />
              <div className="text-sm font-bold text-slate-900">Send Direct Email</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-700" />
          </a>
        </div>
      </div>

      {/* Inquiry Form */}
      <div className="lg:col-span-7">
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-md relative overflow-hidden">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 text-center flex flex-col items-center gap-5"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  {lastActionType === "whatsapp" ? "Opening WhatsApp..." : "Opening Gmail..."}
                </h3>
                <p className="text-slate-600 text-sm max-w-md mt-2">
                  Thank you, <span className="font-semibold text-amber-600">{formData.name}</span>. Your enquiry has been formatted and opened in your selected app.
                </p>
              </div>

              {/* Manual Re-open buttons if pop-up blocker engaged */}
              <div className="w-full max-w-md p-5 rounded-2xl bg-stone-50 border border-slate-200 text-left flex flex-col gap-3 mt-2">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Re-open options:
                </div>
                <div className="flex flex-col gap-2">
                  <a
                    href={whatsappRedirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition shadow-md"
                  >
                    <MessageSquare className="w-4 h-4 fill-white/20" />
                    <span>Open in WhatsApp (+91 8217045680)</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <a
                    href={emailRedirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition shadow-md"
                  >
                    <Mail className="w-4 h-4 text-amber-400" />
                    <span>Open in Gmail (krvbuildersndevelopers@gmail.com)</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-xs font-bold text-slate-500 hover:text-slate-900 underline"
              >
                Submit another enquiry
              </button>
            </motion.div>
          ) : (
            <form onSubmit={(e) => handleSend("whatsapp", e)} className="flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Send an Enquiry</h2>
                <p className="text-xs text-slate-500 mt-1">Fill in your requirements below and choose to send via WhatsApp or Gmail.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-stone-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 Phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-stone-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="yourname@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-stone-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                    Service Required *
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-stone-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition"
                  >
                    <option value="Architectural Planning">Architectural Planning with Vastu</option>
                    <option value="Building Construction">Turnkey Building Construction</option>
                    <option value="Structural Engineering">Structural Engineering & RCC</option>
                    <option value="3D Elevation">Photorealistic 3D Elevation</option>
                    <option value="Interior Design">Interior Design</option>
                    <option value="Estimation & Costing">Estimation & Costing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  Project Details / Plot Dimensions
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g. 30x40 site in Ramanagara, planning G+2 floors residential house..."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-stone-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition"
                />
              </div>

              {/* Action Buttons: WhatsApp & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={(e) => handleSend("whatsapp")}
                  className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <MessageSquare className="w-4 h-4 fill-white/20" />
                  <span>Send via WhatsApp</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={(e) => handleSend("email")}
                  className="w-full py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>Send via Gmail</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="space-y-16 sm:space-y-20 pb-20 overflow-hidden bg-stone-50 text-slate-900">
      {/* HEADER HERO */}
      <section className="relative pt-12 pb-16 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Connect With KRV Engineers</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
              Let’s Discuss Your Next <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
                Construction Project
              </span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-lg max-w-3xl font-normal mt-2 leading-relaxed">
              Have a site to develop, planning a new home, or need structural consultancy? Reach out to our team in Ramanagara.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FORM SECTION WITH SUSPENSE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="text-center text-slate-500 py-10">Loading contact form...</div>}>
          <ContactFormContent />
        </Suspense>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              q: "How do you ensure 100% Vastu compliance?",
              a: "Our architectural planning team incorporates traditional Vastu principles during initial 2D floor layout creation, optimizing room directions, kitchen placement, and main entrance orientation.",
            },
            {
              q: "Do you assist with Ramanagara municipal sanction drawings?",
              a: "Yes, we prepare end-to-end municipal approval drawings and assist with local authority sanction documentation.",
            },
            {
              q: "What is your typical project execution workflow?",
              a: "We begin with site survey and requirement gathering, followed by Vastu 2D blueprint approval, 3D elevation rendering, structural calculation, and turnkey construction supervision.",
            },
            {
              q: "Can I get a custom cost estimation for my 30x40 or 40x60 plot?",
              a: "Absolutely! Contact us via phone or the enquiry form above to receive an itemized BOQ estimation based on your specific requirements.",
            },
          ].map((faq) => (
            <div
              key={faq.q}
              className="p-6 rounded-2xl bg-white border border-slate-200/60 shadow-sm flex flex-col gap-2"
            >
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-7">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
