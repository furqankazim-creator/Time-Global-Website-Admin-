import { useSyncExternalStore } from "react";

interface JobModalState {
  isOpen: boolean;
  jobTitle: string;
  jobSlug: string;
}

let state: JobModalState = {
  isOpen: false,
  jobTitle: "",
  jobSlug: "",
};

const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export function openJobModal(jobTitle = "General Application", jobSlug = "") {
  state = { isOpen: true, jobTitle, jobSlug };
  emitChange();
}

export function closeJobModal() {
  state = { isOpen: false, jobTitle: "", jobSlug: "" };
  emitChange();
}

export function useJobModal<T = JobModalState & { openJobModal: typeof openJobModal; closeJobModal: typeof closeJobModal }>(
  selector?: (s: JobModalState & { openJobModal: typeof openJobModal; closeJobModal: typeof closeJobModal }) => T
): T {
  const snapshot = useSyncExternalStore(
    (onStoreChange) => {
      listeners.add(onStoreChange);
      return () => {
        listeners.delete(onStoreChange);
      };
    },
    () => state,
    () => state
  );

  const full = {
    ...snapshot,
    openJobModal,
    closeJobModal,
  };

  return selector ? selector(full) : (full as unknown as T);
}
