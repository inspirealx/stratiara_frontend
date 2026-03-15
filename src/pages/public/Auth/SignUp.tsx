import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import {
  Mail, Lock, Loader2, AlertCircle, Check, User,
  Building2, Globe, Briefcase, ChevronRight, ChevronLeft, Users
} from 'lucide-react';
import axios from 'axios';
import { PublicNavbar } from '@/components/public-layout/PublicNavbar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const COMPANY_SIZES = ['1–5', '6–20', '21–50', '51–200', '201–500', '500+'];
const INDUSTRIES = [
  'SaaS / Technology', 'Marketing Agency', 'Media & Publishing',
  'E-Commerce', 'Finance & Fintech', 'Healthcare', 'Education',
  'Consulting', 'Real Estate', 'Non-Profit', 'Other',
];

type Step = 1 | 2 | 3;

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  companySize: string;
  industry: string;
  jobTitle: string;
  website: string;
  useCase: string;
}

const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<FormData>({
    fullName: '', email: '', password: '', confirmPassword: '',
    companyName: '', companySize: '', industry: '', jobTitle: '',
    website: '', useCase: '',
  });

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const passwordOk = form.password.length >= 8;
  const passwordsMatch = form.password === form.confirmPassword && form.password.length > 0;

  const validateStep = (): string => {
    if (step === 1) {
      if (!form.fullName.trim()) return 'Full name is required';
      if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Valid work email is required';
      if (!passwordOk) return 'Password must be at least 8 characters';
      if (!passwordsMatch) return 'Passwords do not match';
    }
    if (step === 2) {
      if (!form.companyName.trim()) return 'Company name is required';
      if (!form.companySize) return 'Please select company size';
      if (!form.industry) return 'Please select your industry';
      if (!form.jobTitle.trim()) return 'Job title is required';
    }
    if (step === 3) {
      if (form.useCase.trim().length < 20) return 'Please describe your use case in at least 20 characters';
    }
    return '';
  };

  const nextStep = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError('');
    setStep(s => (s + 1) as Step);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateStep();
    if (err) { setError(err); return; }
    setError('');
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/auth/register`, {
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        companyName: form.companyName,
        companySize: form.companySize,
        industry: form.industry,
        jobTitle: form.jobTitle,
        website: form.website || undefined,
        useCase: form.useCase,
      });
      navigate('/signup/pending', { state: { email: form.email } });
    } catch (err: any) {
      setError(err.response?.data?.userMessage || err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const stepLabels = ['Personal', 'Company', 'Use Case'];

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#8B5CF6]/60 focus:ring-1 focus:ring-[#8B5CF6]/40 transition-all";
  const labelClass = "block text-sm font-medium text-white/70 mb-1.5";

  return (
    <>
      <PublicNavbar />
      <div className="min-h-screen bg-[#0A0E27] flex items-center justify-center px-4 py-16 pt-[84px] relative overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#8B5CF6]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#6366F1]/8 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg relative z-10"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center gap-3 mb-8">
            <img src="/Stratiara Logo.png" alt="Stratiara" className="w-8 h-8 object-contain invert" />
            <span className="text-xl font-bold text-white">Stratiara</span>
          </Link>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Apply for access</h1>
              <p className="text-white/50 text-sm">We review every application personally. We'll be in touch within 48 hours.</p>
            </div>

            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {stepLabels.map((label, idx) => {
                const n = idx + 1;
                const active = step === n;
                const done = step > n;
                return (
                  <div key={n} className="flex items-center gap-2">
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${active ? 'bg-[#8B5CF6]/20 text-[#C4B5FD] border border-[#8B5CF6]/40' : done ? 'bg-[#10B981]/10 text-[#34D399] border border-[#34D399]/30' : 'bg-white/5 text-white/30 border border-white/10'}`}>
                      {done ? <Check size={10} /> : <span className="w-3 text-center">{n}</span>}
                      {label}
                    </div>
                    {idx < stepLabels.length - 1 && <div className="w-5 h-px bg-white/10" />}
                  </div>
                );
              })}
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-5"
                >
                  <AlertCircle size={15} className="text-red-400 shrink-0" />
                  <span className="text-sm text-red-300">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {/* ─ Step 1: Personal ─ */}
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-4">
                    <div>
                      <label className={labelClass}>Full Name</label>
                      <div className="relative">
                        <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                        <input className={inputClass + " pl-10"} placeholder="Jane Doe" value={form.fullName} onChange={set('fullName')} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Work Email</label>
                      <div className="relative">
                        <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                        <input type="email" className={inputClass + " pl-10"} placeholder="jane@company.com" value={form.email} onChange={set('email')} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Password</label>
                      <div className="relative">
                        <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                        <input type="password" className={inputClass + " pl-10"} placeholder="Min. 8 characters" value={form.password} onChange={set('password')} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Confirm Password</label>
                      <div className="relative">
                        <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                        <input type="password" className={inputClass + " pl-10"} placeholder="Repeat password" value={form.confirmPassword} onChange={set('confirmPassword')} />
                      </div>
                    </div>
                    {(form.password || form.confirmPassword) && (
                      <div className="flex gap-4 pt-1">
                        <span className={`text-xs flex items-center gap-1 ${passwordOk ? 'text-[#34D399]' : 'text-white/30'}`}><Check size={11} />8+ chars</span>
                        <span className={`text-xs flex items-center gap-1 ${passwordsMatch ? 'text-[#34D399]' : 'text-white/30'}`}><Check size={11} />Passwords match</span>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ─ Step 2: Company ─ */}
                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-4">
                    <div>
                      <label className={labelClass}>Company Name</label>
                      <div className="relative">
                        <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                        <input className={inputClass + " pl-10"} placeholder="Acme Corp" value={form.companyName} onChange={set('companyName')} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Company Size</label>
                        <div className="relative">
                          <Users size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                          <select className={inputClass + " pl-10 appearance-none cursor-pointer"} value={form.companySize} onChange={set('companySize')}>
                            <option value="" className="bg-[#0A0E27]">Employees</option>
                            {COMPANY_SIZES.map(s => <option key={s} value={s} className="bg-[#0A0E27]">{s}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>Industry</label>
                        <select className={inputClass + " appearance-none cursor-pointer"} value={form.industry} onChange={set('industry')}>
                          <option value="" className="bg-[#0A0E27]">Select</option>
                          {INDUSTRIES.map(i => <option key={i} value={i} className="bg-[#0A0E27]">{i}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Your Job Title</label>
                      <div className="relative">
                        <Briefcase size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                        <input className={inputClass + " pl-10"} placeholder="Head of Content" value={form.jobTitle} onChange={set('jobTitle')} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Company Website <span className="text-white/30 font-normal">(optional)</span></label>
                      <div className="relative">
                        <Globe size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                        <input className={inputClass + " pl-10"} placeholder="https://yourcompany.com" value={form.website} onChange={set('website')} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ─ Step 3: Use Case ─ */}
                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-4">
                    <div>
                      <label className={labelClass}>How do you plan to use Stratiara?</label>
                      <textarea
                        className={inputClass + " resize-none h-36 pt-3"}
                        placeholder="Tell us about your content strategy goals, current workflow, and what you're hoping to achieve with Stratiara..."
                        value={form.useCase}
                        onChange={set('useCase')}
                      />
                      <p className="text-xs text-white/25 mt-1.5">{form.useCase.length} characters (min. 20)</p>
                    </div>
                    <div className="bg-[#8B5CF6]/5 border border-[#8B5CF6]/20 rounded-xl p-4">
                      <p className="text-sm text-white/50 leading-relaxed">
                        We're accepting <strong className="text-white/70">15 companies</strong> in this cohort. Our team personally reviews every application — detailed answers help us make quicker decisions.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              <div className={`flex mt-6 gap-3 ${step > 1 ? 'justify-between' : 'justify-end'}`}>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => { setError(''); setStep(s => (s - 1) as Step); }}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 text-white/60 text-sm font-medium hover:bg-white/5 hover:text-white transition-all"
                  >
                    <ChevronLeft size={16} /> Back
                  </button>
                )}
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white text-sm font-semibold hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(139,92,246,0.4)] transition-all"
                  >
                    Continue <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white text-sm font-semibold hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(139,92,246,0.4)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : 'Submit Application'}
                  </button>
                )}
              </div>
            </form>

            <p className="text-center text-sm text-white/30 mt-6">
              Already have an account?{' '}
              <Link to="/signin" className="text-[#A78BFA] hover:text-white transition-colors">Sign in</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default SignUp;
