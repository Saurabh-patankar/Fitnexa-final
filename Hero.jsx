import { motion } from "framer-motion";

export default function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="h-screen flex items-center justify-center bg-gray-900 text-pink-400 text-5xl font-bold"
    >
      Welcome to FitNexa
    </motion.section>
  );
}
