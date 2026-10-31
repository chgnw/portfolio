"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
}

export const CertificateModal = ({ isOpen, onClose, imageSrc }: CertificateModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && imageSrc && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl h-auto max-h-[90vh] p-4 rounded-xl shadow-2xl glass-effect border-none"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute -top-3 -right-3 z-10 w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full hover:scale-110 transition-transform"
            >
              <FiX size={20} />
            </button>
            <div className="relative w-full h-full max-h-[85vh] overflow-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageSrc} alt="Certificate" className="w-full h-auto object-contain" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
