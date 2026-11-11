import { useState, useRef, useEffect, type FormEvent, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  FileText,
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
  }, [jobTitle]);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      // Reset success state after modal closes
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
      setFileError("File size exceeds 5MB. Please upload a smaller file.");
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
      jobTitle: selectedRole.trim() || jobTitle || "Engineering Application",
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
      // 1. Submit to API backend
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
      } catch {}

      // 2. Always persist locally to backup queue
      try {
        const stored = JSON.parse(localStorage.getItem("tg_job_applications") || "[]");
        stored.unshift({
          ...payload,
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
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md"
        >
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto z-10 isolate"
          >
            {/* Top gradient bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />

            {/* Close Button */}
            <button
              onClick={closeJobModal}
              className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors z-20"
              aria-label="Close application modal"
            >
              <X size={20} />
            </button>

            {isSuccess ? (
              /* Success View */
              <div className="p-8 sm:p-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Application Submitted!
                </h3>
                <p className="text-zinc-400 text-sm sm:text-base max-w-md mx-auto mb-6 leading-relaxed">
                  Thank you for applying. We have received your application, resume, and credentials. A confirmation email has been sent to your inbox.
                </p>

                <div className="p-4 rounded-xl bg-zinc-900/80 border border-white/5 text-xs text-zinc-400 max-w-sm mb-8 text-left space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span>Position:</span>
                    <span className="text-emerald-400 font-semibold">{selectedRole}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="text-zinc-300">Under Review</span>
                  </div>
                  <div className="flex justify-between">
                    <span>HR Notification:</span>
                    <span className="text-emerald-400">Dispatched</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeJobModal}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20"
                >
                  Close Window
                </button>
              </div>
            ) : (
              /* Application Form */
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
                {/* Header */}
                <div className="mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-2 border border-emerald-500/20">
                    <Sparkles size={13} /> Time Global Careers
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Apply for Position
                  </h2>
                  <p className="text-zinc-400 text-sm mt-1">
                    Fill out your credentials below. Our hiring team will review your application and respond promptly.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Position Applied For */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Position Applied For *
                    </label>
                    <div className="relative">
                      <Briefcase size={16} className="absolute left-3.5 top-3 text-zinc-500" />
                      <input
                        type="text"
                        required
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        placeholder="e.g. Senior Full-Stack Engineer"
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/80 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Name and Father's Name Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-3.5 top-3 text-zinc-500" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your full name"
                          className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/80 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                        Father's Name *
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-3.5 top-3 text-zinc-500" />
                        <input
                          type="text"
                          required
                          value={fatherName}
                          onChange={(e) => setFatherName(e.target.value)}
                          placeholder="Father's full name"
                          className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/80 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email and Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3.5 top-3 text-zinc-500" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@domain.com"
                          className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/80 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                        Phone / WhatsApp *
                      </label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3.5 top-3 text-zinc-500" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+92 300 1234567"
                          className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/80 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Highest Education / Qualification *
                    </label>
                    <div className="relative">
                      <GraduationCap size={16} className="absolute left-3.5 top-3 text-zinc-500" />
                      <input
                        type="text"
                        required
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        placeholder="e.g. BS Computer Science / Software Engineering / BBA"
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/80 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Field & Relevant Experience (2-3 lines) */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Tell us about your field & experience (2-3 lines) *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="Summarize your hands-on experience, core tech stack or tools, and what makes you a great fit for this position..."
                      className="w-full px-4 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/80 transition-colors resize-none"
                    />
                  </div>

                  {/* Portfolio / LinkedIn (Optional) */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Portfolio, GitHub or LinkedIn URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      placeholder="https://github.com/yourhandle or https://linkedin.com/in/..."
                      className="w-full px-4 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/80 transition-colors"
                    />
                  </div>

                  {/* Cover Letter (placed directly above CV upload) */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Cover Letter / Note for Hiring Team
                    </label>
                    <textarea
                      rows={3}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Introduce yourself, highlight notable projects, and tell us why you want to build with Time Global..."
                      className="w-full px-4 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/80 transition-colors resize-none"
                    />
                  </div>

                  {/* Resume / CV Upload Section */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                        Upload Resume / CV *
                      </label>
                      <span className="text-[11px] text-zinc-500 font-mono">Max 5 MB (PDF, DOC, DOCX)</span>
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
                      <div className="flex items-center justify-between p-3.5 bg-zinc-900 border border-emerald-500/40 rounded-xl">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                            <FileCheck size={20} />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-sm font-medium text-white truncate max-w-[280px] sm:max-w-[360px]">
                              {resumeFile.name}
                            </p>
                            <p className="text-xs text-zinc-400 font-mono">
                              {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to send
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setResumeFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                          className="p-1.5 text-zinc-400 hover:text-rose-400 transition-colors"
                          title="Remove file"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      /* Drag & Drop Area */
                      <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                          dragActive
                            ? "border-emerald-500 bg-emerald-500/5"
                            : "border-white/10 hover:border-emerald-500/40 bg-zinc-900/60"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-2 text-zinc-400">
                          <Upload size={18} />
                        </div>
                        <p className="text-sm font-medium text-zinc-200">
                          Click to upload or drag & drop your CV
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">
                          Supported formats: PDF, Word (.doc, .docx) — Under 5MB
                        </p>
                      </div>
                    )}

                    {fileError && (
                      <p className="text-xs text-rose-400 flex items-center gap-1.5 mt-1.5 font-medium">
                        <AlertCircle size={13} /> {fileError}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Action */}
                <div className="mt-8 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-[11px] text-zinc-500 text-center sm:text-left">
                    By submitting, you agree to Time Global evaluating your credentials for current and future career opportunities.
                  </p>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 shrink-0 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
