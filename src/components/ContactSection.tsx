import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Github, 
  Copy, 
  Check, 
  Send, 
  ExternalLink,
  MessageSquare,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { contactData, candidateInfo } from '../data/portfolioData';

interface ContactSectionProps {
  isDarkMode: boolean;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ isDarkMode }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleCopy = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2200);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setFormStatus('sending');
    setTimeout(() => {
      setFormStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setFormStatus('idle'), 4000);
    }, 900);
  };

  const mailtoLink = `mailto:${contactData.email}?subject=${encodeURIComponent(
    formData.subject || 'Inquiry regarding Software Engineer / Java Developer Opportunity'
  )}&body=${encodeURIComponent(
    `Hello Chandan,\n\nName: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
  )}`;

  return (
    <section id="contact" className="py-20 border-t border-zinc-200 dark:border-zinc-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-left max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>GET IN TOUCH</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>
            Let's Connect
          </h2>
          <p className={`mt-3 text-base sm:text-lg ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
            I am actively looking for SDE-1 / Java Developer roles and would love to discuss how my backend and full-stack expertise can contribute to your team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Contact Details & Social Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Email Card */}
            <div className={`p-5 rounded-2xl border transition-all ${
              isDarkMode ? 'bg-zinc-900/70 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 font-mono">Email Address</div>
                    <a
                      href={`mailto:${contactData.email}`}
                      className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-white hover:text-indigo-500 transition-colors break-all"
                    >
                      {contactData.email}
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(contactData.email, 'email')}
                  className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                  title="Copy email to clipboard"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Phone Card */}
            <div className={`p-5 rounded-2xl border transition-all ${
              isDarkMode ? 'bg-zinc-900/70 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-500 flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 font-mono">Phone / WhatsApp</div>
                    <a
                      href={`tel:${contactData.phone}`}
                      className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-white hover:text-indigo-500 transition-colors"
                    >
                      {contactData.phone}
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(contactData.phone, 'phone')}
                  className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                  title="Copy phone to clipboard"
                >
                  {copiedPhone ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Location Card */}
            <div className={`p-5 rounded-2xl border transition-all ${
              isDarkMode ? 'bg-zinc-900/70 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-500 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-zinc-500 font-mono">Location</div>
                  <div className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-white">
                    {contactData.location}
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links Cards */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <a
                href={contactData.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-4 rounded-xl border flex items-center gap-3 transition-colors ${
                  isDarkMode
                    ? 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white'
                    : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-800'
                }`}
              >
                <Linkedin className="w-5 h-5 text-blue-500 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-zinc-500">LinkedIn</div>
                  <div className="text-xs font-semibold truncate font-mono">chan2004</div>
                </div>
              </a>

              <a
                href={contactData.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-4 rounded-xl border flex items-center gap-3 transition-colors ${
                  isDarkMode
                    ? 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white'
                    : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-800'
                }`}
              >
                <Github className="w-5 h-5 shrink-0 text-zinc-400" />
                <div className="min-w-0">
                  <div className="text-xs text-zinc-500">GitHub</div>
                  <div className="text-xs font-semibold truncate font-mono">Chan236</div>
                </div>
              </a>
            </div>

          </div>

          {/* Interactive Message Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className={`p-6 sm:p-8 rounded-2xl border transition-all ${
              isDarkMode
                ? 'bg-zinc-900/80 border-zinc-800 shadow-xl shadow-black/30'
                : 'bg-white border-zinc-200 shadow-md'
            }`}>
              <h3 className={`text-xl font-bold tracking-tight mb-2 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                Send a Direct Message
              </h3>
              <p className={`text-xs sm:text-sm mb-6 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Whether you have a vacancy for an SDE-1 / Java Engineer or want to discuss enterprise architecture, drop a message below.
              </p>

              {formStatus === 'success' ? (
                <div className="p-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-zinc-900 dark:text-white">Message Sent Successfully!</h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">
                    Thank you for reaching out. Chandan will review your message and reply promptly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Jane Doe"
                        className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                          isDarkMode
                            ? 'bg-zinc-950 border-zinc-800 text-white placeholder-zinc-600'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="jane@company.com"
                        className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                          isDarkMode
                            ? 'bg-zinc-950 border-zinc-800 text-white placeholder-zinc-600'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. SDE-1 Opening at [Company Name]"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                        isDarkMode
                          ? 'bg-zinc-950 border-zinc-800 text-white placeholder-zinc-600'
                          : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">
                      Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Hi Chandan, we came across your banking microservices work and would like to talk..."
                      className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none ${
                        isDarkMode
                          ? 'bg-zinc-950 border-zinc-800 text-white placeholder-zinc-600'
                          : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400'
                      }`}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={formStatus === 'sending'}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/25 transition-all disabled:opacity-50"
                    >
                      {formStatus === 'sending' ? (
                        <span>Sending message...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>

                    <a
                      href={mailtoLink}
                      className="text-xs text-zinc-500 hover:text-indigo-500 dark:hover:text-indigo-400 underline underline-offset-4 inline-flex items-center gap-1"
                    >
                      <span>Or compose in your email client</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
