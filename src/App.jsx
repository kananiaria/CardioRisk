import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import IntroPage from "./components/IntroPage";
import AssessmentForm from "./components/AssessmentForm";

function App() {
  const [currentPage, setCurrentPage] = useState("intro");

  const handleGetStarted = () => {
    setCurrentPage("assessment");
  };

  const handleBack = () => {
    setCurrentPage("intro");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <AnimatePresence mode="wait">
        {currentPage === "intro" ? (
          <motion.div
            key="intro-page"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 0.35 }}
          >
            <IntroPage onGetStarted={handleGetStarted} />
          </motion.div>
        ) : (
          <motion.div
            key="assessment-page"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 0.35 }}
          >
            <AssessmentForm onBack={handleBack} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
