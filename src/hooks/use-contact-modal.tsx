import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface ContactModalContextType {
  isOpen: boolean;
  isWelcome: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const ContactModalContext = createContext<ContactModalContextType | undefined>(undefined);

export function ContactModalProvider({ children }: { children: ReactNode }) {
  // Welcome visitors on each full website load, without reopening on SPA navigation.
  const [isOpen, setIsOpen] = useState(true);
  const [isWelcome, setIsWelcome] = useState(true);
  const openModal = useCallback(() => {
    setIsWelcome(false);
    setIsOpen(true);
  }, []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  return (
    <ContactModalContext.Provider value={{ isOpen, isWelcome, openModal, closeModal }}>
      {children}
    </ContactModalContext.Provider>
  );
}

export function useContactModal() {
  const context = useContext(ContactModalContext);
  if (!context) {
    throw new Error("useContactModal must be used within a ContactModalProvider");
  }
  return context;
}
