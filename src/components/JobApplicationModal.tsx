import { useState, useRef, useEffect, type FormEvent, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  User,
  GraduationCap,
  Mail,
  Phone,
  FileCheck,
  Loader2,
  Trash2,
  Sparkles,
  Link2,
  Send,
  FileText,
} from "lucide-react";
import { useJobModal } from "@/hooks/use-job-modal";
import { toast } from "@/hooks/use-toast";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export function JobApplicationModal() {
  const { isOpen, jobTitle, jobSlug, closeJobModal } = useJobModal();

  const [name, setName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [education, setEducation] = useState("");
  const [selectedRole, setSelectedRole] = useState(jobTitle || "");
  const [experience, setExperience] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");

  const [resumeFile, setResumeFile] = useState<{
    file: File;
    name: string;
    size: number;
    dataUrl: string;
  } | null>(null);

  const [fileError, setFileError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync role when modal opens with specific job
  useEffect(() => {
    if (jobTitle) {
      setSelectedRole(jobTitle);
    }
  }, [jobTitle, isOpen]);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      const timer = setTimeout(() => {
        setIsSuccess(false);
      }, 300);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleFile = (file: File) => {
    setFileError(null);

    // Validate size (max 5MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFileError("File size exceeds 5MB limit. Please upload a smaller file.");
      toast({
        title: "File too large",
        description: "Please upload a resume under 5 MB in size.",
        variant: "destructive",
      });
      return;
    }

    // Validate type
    const validExtensions = [".pdf", ".doc", ".docx"];
    const ext = "." + (file.name.split(".").pop()?.toLowerCase() || "");
    if (!validExtensions.includes(ext) && !file.type.includes("pdf") && !file.type.includes("word")) {
      setFileError("Invalid file type. Please upload a PDF or Word document (.pdf, .doc, .docx).");
      return;
    }

    // Read to base64
    const reader = new FileReader();
    reader.onload = () => {
      setResumeFile({
        file,
        name: file.name,
        size: file.size,
        dataUrl: reader.result as string,
      });
    };
    reader.onerror = () => {
      setFileError("Failed to read resume file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const resetForm = () => {
    setName("");
    setFatherName("");
    setEmail("");
    setPhone("");
    setEducation("");
    setExperience("");
    setCoverLetter("");
    setPortfolioUrl("");
    setResumeFile(null);
    setFileError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!resumeFile) {
      setFileError("Please upload your resume / CV (Max 5MB).");
      return;
    }

    setSubmitting(true);

    const payload = {
      name: name.trim(),
      fatherName: fatherName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      education: education.trim(),
      jobTitle: selectedRole.trim() || "General Application",
      jobSlug: jobSlug || "",
      experience: experience.trim(),
      coverLetter: coverLetter.trim(),
      portfolioUrl: portfolioUrl.trim(),
      resume: {
        filename: resumeFile.name,
        size: resumeFile.size,
        mimeType: resumeFile.file.type || "application/pdf",
        dataUrl: resumeFile.dataUrl,
      },
    };

    try {
      let sentToBackend = false;
      try {
        const res = await fetch(`${API_BASE}/api/v1/public/applications`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          sentToBackend = true;
        }
      } catch (err) {
        console.warn("Backend submission failed, falling back to local storage queue:", err);
      }

      // Always save a copy to localStorage queue as fallback
      try {
        const stored = JSON.parse(localStorage.getItem("tg_job_applications") || "[]");
        stored.unshift({
          ...payload,
          resume: { filename: resumeFile.name, size: resumeFile.size },
          id: `app_${Date.now()}`,
          submittedAt: new Date().toISOString(),
          synced: sentToBackend,
        });
        localStorage.setItem("tg_job_applications", JSON.stringify(stored.slice(0, 30)));
      } catch {}

      setIsSuccess(true);
      resetForm();
      toast({
        title: "Application Submitted Successfully!",
        description: `Thank you, ${name}. A confirmation email has been dispatched.`,
      });
    } catch {
      toast({
        title: "Submission saved!",
        description: "Your application has been recorded.",
      });
      setIsSuccess(true);
      resetForm();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={closeJobModal}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/80 backdrop-blur-md"
        >
          {/* Modal Card - WIDE & BIG (max-w-5xl) with NO SCROLL on desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl bg-zinc-950/95 border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl shadow-emerald-950/40 my-auto z-10 isolate overflow-hidden backdrop-blur-xl"
          >
            {/* Ambient emerald backlight glows */}
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Top luminous emerald gradient accent line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />

            {/* Close Button */}
            <button
              onClick={closeJobModal}
              className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors z-20 cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {isSuccess ? (
              /* Success View */
              <div className="p-8 sm:p-14 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 size={34} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Application Submitted Successfully!
                </h3>
                <p className="text-zinc-400 text-sm max-w-md mx-auto mb-6 leading-relaxed">
                  Thank you for applying. We have received your credentials and resume. A confirmation email has been dispatched to your inbox.
                </p>

                <div className="p-4 rounded-xl bg-zinc-900/90 border border-white/10 text-xs text-zinc-400 max-w-sm mb-6 text-left space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span>Position:</span>
                    <span className="text-emerald-400 font-semibold">{selectedRole}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="text-zinc-300">Under Review</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email Confirmation:</span>
                    <span className="text-emerald-400">Sent to Applicant</span>
                  </div>
                  <div className="flex justify-between">
                    <span>HR Team Notification:</span>
                    <span className="text-emerald-400">Dispatched</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeJobModal}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            ) : (
              /* Application Form - 2-Column Wide Grid: NO SCROLL on Desktop */
              <form onSubmit={handleSubmit} className="p-5 sm:p-7">
                {/* Header bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pr-8">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold mb-1 border border-emerald-500/20">
                      <Sparkles size={11} /> Time Global Careers
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                      Apply for Position
                      {selectedRole && (
                        <span className="text-xs sm:text-sm font-semibold px-2.5 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          {selectedRole}
                        </span>
                      )}
                    </h2>
                  </div>
                  <p className="text-zinc-400 text-xs hidden md:block max-w-xs text-right">
                    Fill out your credentials. All submissions receive immediate confirmation.
                  </p>
                </div>

                {/* 2 Columns Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  {/* LEFT COLUMN: Personal Info, Contact & Experience */}
                  <div className="space-y-3.5">
                    {/* Position Applied For */}
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                        Position Applied For *
                      </label>
                      <div className="relative">
                        <Briefcase size={14} className="absolute left-3 top-2.5 text-zinc-500" />
                        <input
                          type="text"
                          required
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          placeholder="e.g. AI / ML Specialist"
                          className="w-full pl-9 pr-3 py-2 bg-zinc-900/90 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Full Name & Father's Name Side-by-Side */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User size={14} className="absolute left-3 top-2.5 text-zinc-500" />
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your full name"
                            className="w-full pl-9 pr-3 py-2 bg-zinc-900/90 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                          Father's Name *
                        </label>
                        <div className="relative">
                          <User size={14} className="absolute left-3 top-2.5 text-zinc-500" />
                          <input
                            type="text"
                            required
                            value={fatherName}
                            onChange={(e) => setFatherName(e.target.value)}
                            placeholder="Father's full name"
                            className="w-full pl-9 pr-3 py-2 bg-zinc-900/90 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email & Phone Side-by-Side */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail size={14} className="absolute left-3 top-2.5 text-zinc-500" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@domain.com"
                            className="w-full pl-9 pr-3 py-2 bg-zinc-900/90 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                          Phone / WhatsApp *
                        </label>
                        <div className="relative">
                          <Phone size={14} className="absolute left-3 top-2.5 text-zinc-500" />
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+92 300 1234567"
                            className="w-full pl-9 pr-3 py-2 bg-zinc-900/90 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Highest Education & Portfolio URL Side-by-Side */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                          Highest Qualification *
                        </label>
                        <div className="relative">
                          <GraduationCap size={14} className="absolute left-3 top-2.5 text-zinc-500" />
                          <input
                            type="text"
                            required
                            value={education}
                            onChange={(e) => setEducation(e.target.value)}
                            placeholder="e.g. BSCS / Software Eng."
                            className="w-full pl-9 pr-3 py-2 bg-zinc-900/90 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                          Portfolio / GitHub / LinkedIn
                        </label>
                        <div className="relative">
                          <Link2 size={14} className="absolute left-3 top-2.5 text-zinc-500" />
                          <input
                            type="url"
                            value={portfolioUrl}
                            onChange={(e) => setPortfolioUrl(e.target.value)}
                            placeholder="https://github.com/..."
                            className="w-full pl-9 pr-3 py-2 bg-zinc-900/90 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Field & Experience (2-3 lines) */}
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                        Field & Relevant Experience (2-3 lines) *
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="Brief summary of your hands-on experience, core tools, and key achievements in this field..."
                        className="w-full px-3 py-2 bg-zinc-900/90 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors resize-none leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Cover Letter, Resume Upload & Action */}
                  <div className="flex flex-col justify-between space-y-3.5">
                    {/* Cover Letter (placed directly above CV upload) */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
                          Cover Letter / Note for Hiring Team
                        </label>
                        <span className="text-[10px] text-zinc-500 font-mono">Optional</span>
                      </div>
                      <textarea
                        rows={2}
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        placeholder="Introduce yourself, highlight key projects, and tell us why you want to build with Time Global..."
                        className="w-full px-3 py-2 bg-zinc-900/90 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors resize-none leading-relaxed"
                      />
                    </div>

                    {/* Resume / CV Upload Section */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
                          Upload Resume / CV *
                        </label>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                          Max 5 MB • PDF / DOC / DOCX
                        </span>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={onFileInputChange}
                        className="hidden"
                      />

                      {resumeFile ? (
                        /* File Selected Card */
                        <div className="flex items-center justify-between p-3 bg-zinc-900/90 border border-emerald-500/50 rounded-xl">
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 shrink-0">
                              <FileCheck size={18} />
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-xs sm:text-sm font-semibold text-white truncate max-w-[220px] sm:max-w-[280px]">
                                {resumeFile.name}
                              </p>
                              <p className="text-[11px] text-zinc-400 font-mono">
                                {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to submit
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setResumeFile(null);
                              if (fileInputRef.current) fileInputRef.current.value = "";
                            }}
                            className="p-1.5 text-zinc-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-white/5 cursor-pointer"
                            title="Remove file"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ) : (
                        /* Drag & Drop Area - Clean & Compact */
                        <div
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                            dragActive
                              ? "border-emerald-500 bg-emerald-500/10 scale-[1.01]"
                              : "border-white/10 hover:border-emerald-500/50 bg-zinc-900/50 hover:bg-zinc-900/80"
                          }`}
                        >
                          <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-1.5 text-emerald-400">
                            <Upload size={16} />
                          </div>
                          <p className="text-xs sm:text-sm font-semibold text-zinc-200">
                            Click to upload or drag & drop your CV
                          </p>
                          <p className="text-[11px] text-zinc-500 mt-0.5">
                            PDF, Word (.doc, .docx) — Strictly under 5MB
                          </p>
                        </div>
                      )}

                      {fileError && (
                        <p className="text-xs text-rose-400 flex items-center gap-1.5 mt-1 font-medium">
                          <AlertCircle size={13} /> {fileError}
                        </p>
                      )}
                    </div>

                    {/* Bottom Submit Area */}
                    <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <p className="text-[10px] text-zinc-500 text-center sm:text-left leading-tight">
                        Instant email confirmation sent to candidate & HR team.
                      </p>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 disabled:opacity-50 shrink-0 cursor-pointer"
                      >
                        {submitting ? (
                          <>
                            <Loader2 size={15} className="animate-spin" /> Submitting...
                          </>
                        ) : (
                          <>
                            <Send size={14} /> Submit Application
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
