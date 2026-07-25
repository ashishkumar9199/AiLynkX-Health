import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  X, 
  Send, 
  CheckCircle2, 
  Star, 
  Loader2, 
  Mail,
  AlertCircle
} from 'lucide-react';

export const FeedbackToggle: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<'Compliment' | 'Suggestion' | 'Bug Report' | 'Other'>('Suggestion');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  // Prefill name and email if patient profile exists
  useEffect(() => {
    const profileStr = localStorage.getItem('patient_profile');
    if (profileStr) {
      try {
        const profile = JSON.parse(profileStr);
        if (profile.name) setName(profile.name);
        if (profile.email) setEmail(profile.email);
      } catch (e) {
        // ignore
      }
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          category,
          rating,
          message: message.trim()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
      } else {
        throw new Error(data.error || 'Failed to submit feedback');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'An error occurred while transmitting feedback. Please check your internet connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Build mailto URL for fallback or manual direct email client launching
  const getMailtoUrl = () => {
    const subject = encodeURIComponent(`[AiLynkX] ${category} from ${name}`);
    const body = encodeURIComponent(
      `Hello Admin,\n\nI wanted to share my feedback with you.\n\n` +
      `Category: ${category}\n` +
      `Rating: ${rating}/5 Stars\n` +
      `My Name: ${name}\n` +
      `My Email: ${email}\n\n` +
      `Message:\n"${message}"\n\n` +
      `---\nSubmitted via AiLynkX Portal Feedback`
    );
    return `mailto:ailynkhealth@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleReset = () => {
    setIsOpen(false);
    setIsSuccess(false);
    setMessage('');
    setRating(5);
    setCategory('Suggestion');
    setErrorMessage('');
  };

  return (
    <>
      {/* Floating Toggle Button (Bottom Left) */}
      {!isOpen && (
        <button
          id="feedback-toggle-trigger"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-40 bg-slate-900 hover:bg-slate-800 text-white pl-4 pr-5 py-3 rounded-full shadow-2xl transition-all hover:scale-105 duration-300 flex items-center gap-2 border-2 border-white cursor-pointer group"
          title="Share Feedback or Suggestion"
        >
          <Megaphone className="w-4.5 h-4.5 text-red-500 animate-pulse" />
          <span className="text-[11px] font-black tracking-wider uppercase">Feedback</span>
        </button>
      )}

      {/* Feedback Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div 
            id="feedback-modal-box"
            className="bg-white w-full max-w-md rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
          >
            {/* Header */}
            <div className="bg-slate-950 text-white p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600/10 border border-red-500/20 rounded-xl flex items-center justify-center text-red-500">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm tracking-tight">Share Feedback</h3>
                  <p className="text-[10px] text-slate-400 font-medium">To: ailynkhealth@gmail.com</p>
                </div>
              </div>
              <button 
                onClick={handleReset}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5 text-xs">
              
              {isSuccess ? (
                <div className="space-y-5 text-center py-6 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-100">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-base font-extrabold text-slate-900">Thank You!</h4>
                    <p className="text-slate-500 leading-relaxed font-medium">
                      Your feedback has been successfully registered and sent directly to our team inbox at <span className="font-bold text-slate-800">ailynkhealth@gmail.com</span>. We read every suggestion carefully!
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 text-left">
                    <p className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wide">Prefer a Direct Email Copy?</p>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      If you'd like to open your native mail program (such as Outlook, Apple Mail, or Gmail) with this feedback already pre-filled to send directly, click below:
                    </p>
                    <a 
                      href={getMailtoUrl()}
                      className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-3 py-2 rounded-xl transition-all shadow-xs text-[10px] uppercase mt-1"
                    >
                      <Mail className="w-3.5 h-3.5 text-red-500" />
                      Send Direct Email Copy
                    </a>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handleReset}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-3 rounded-xl transition-all text-xs"
                    >
                      Return to Website
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <p className="text-slate-500 leading-relaxed font-medium">
                    We're committed to making health consultations seamless. Help us improve our clinic tools, lab dispatch scheduling, and portal interfaces.
                  </p>

                  {errorMessage && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-start gap-2.5 font-medium animate-in slide-in-from-top-2 duration-200">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1">
                      <label className="block text-slate-700 font-bold">Your Name <span className="text-red-500">*</span></label>
                      <input 
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-800 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/5 transition-all font-medium"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="block text-slate-700 font-bold">Your Email <span className="text-red-500">*</span></label>
                      <input 
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. john@example.com"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-800 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/5 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Category */}
                    <div className="space-y-1">
                      <label className="block text-slate-700 font-bold">Topic / Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-800 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/5 transition-all font-medium"
                      >
                        <option value="Suggestion">Suggestion / Feature</option>
                        <option value="Compliment">Compliment / Praise</option>
                        <option value="Bug Report">Technical Issue / Bug</option>
                        <option value="Other">General Inquiry</option>
                      </select>
                    </div>

                    {/* Interactive Star Rating */}
                    <div className="space-y-1">
                      <label className="block text-slate-700 font-bold">Experience Rating</label>
                      <div className="flex items-center gap-1.5 py-2.5">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const active = star <= (hoverRating !== null ? hoverRating : rating);
                          return (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(null)}
                              className="text-slate-300 hover:scale-110 transition-transform cursor-pointer"
                            >
                              <Star 
                                className={`w-5 h-5 ${
                                  active 
                                    ? 'text-amber-500 fill-amber-500' 
                                    : 'text-slate-300'
                                }`} 
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1">
                    <label className="block text-slate-700 font-bold">Your Message <span className="text-red-500">*</span></label>
                    <textarea 
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your feedback, suggestions, or describe a bug..."
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-800 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/5 transition-all font-medium leading-normal resize-none"
                    />
                  </div>

                  {/* Submit buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black py-3.5 rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 uppercase tracking-wider text-[10px] cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Feedback</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleReset}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold px-5 py-3.5 rounded-2xl transition-all text-[10px] uppercase tracking-wide cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
};
