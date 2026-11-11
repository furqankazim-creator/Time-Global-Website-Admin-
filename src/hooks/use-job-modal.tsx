import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface JobModalContextType {
  isOpen: boolean;
  jobTitle: string;
  jobSlug: string;
  openJobModal: (jobTitle?: string, jobSlug?: string) => void;
  closeJobModal: () => void;
}

const JobModalContext = createContext<JobModalContextType | undefined>(undefined);

let globalOpenModal: ((jobTitle?: string, jobSlug?: string) => void) | null = null;
let globalCloseModal: (() => void) | null = null;

export function openJobModal(jobTitle = "General Application", jobSlug = "") {
  if (globalOpenModal) {
    globalOpenModal(jobTitle, jobSlug);
  }
}

export function closeJobModal() {
  if (globalCloseModal) {
    globalCloseModal();
  }
}

export function JobModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobSlug, setJobSlug] = useState("");

  const handleOpen = useCallback((title = "General Application", slug = "") => {
    setJobTitle(title);
    setJobSlug(slug);
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setJobTitle("");
    setJobSlug("");
  }, []);

  globalOpenModal = handleOpen;
  globalCloseModal = handleClose;

  return (
    <JobModalContext.Provider
      value={{
        isOpen,
        jobTitle,
        jobSlug,
        openJobModal: handleOpen,
        closeJobModal: handleClose,
      }}
    >
      {children}
    </JobModalContext.Provider>
  );
}

export function useJobModal() {
  const context = useContext(JobModalContext);
  if (!context) {
    return {
      isOpen: false,
      jobTitle: "",
      jobSlug: "",
      openJobModal,
      closeJobModal,
    };
  }
  return context;
}
