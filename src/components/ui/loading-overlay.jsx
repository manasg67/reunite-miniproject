import React from "react";
import { motion } from "framer-motion";
import { FileText, Loader2 } from "lucide-react";

export function LoadingOverlay({ message }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center"
      >
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <FileText className="w-8 h-8 text-blue-500" />
          </motion.div>
        </div>
        <p className="mt-4 text-lg font-medium text-gray-700">{message}</p>
      </motion.div>
    </motion.div>
  );
} 