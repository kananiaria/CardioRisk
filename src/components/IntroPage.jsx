import { motion } from "framer-motion";
import {
  HeartPulse,
  Activity,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

function IntroPage({ onGetStarted }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10 bg-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl"
      >
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* Left Section */}
            <div className="p-10 lg:p-14 flex flex-col justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <div className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                  <HeartPulse
                    className="text-red-500"
                    size={42}
                    strokeWidth={2.5}
                  />
                </div>
              </motion.div>

              <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-white">
                Cardiovascular Risk
                <span className="block text-cyan-400">
                  Stratification Tool
                </span>
              </h1>

              <p className="mt-4 text-lg text-slate-300 font-medium">
                Screening & Early Referral Support
              </p>

              <p className="mt-8 text-slate-400 leading-relaxed">
                This clinical decision-support interface is designed to
                facilitate structured cardiovascular risk assessment using
                established parameters derived from the Cleveland Heart Disease
                dataset.
              </p>

              <p className="mt-4 text-slate-400 leading-relaxed">
                It assists healthcare professionals and researchers in
                documenting findings systematically to support early referral
                and further evaluation.
              </p>

              <div className="mt-8 flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                <ShieldAlert
                  className="text-amber-400 flex-shrink-0 mt-0.5"
                  size={22}
                />

                <div>
                  <p className="font-semibold text-amber-300">
                    Clinical Disclaimer
                  </p>

                  <p className="mt-1 text-sm text-slate-300 leading-relaxed">
                    This tool is intended solely for educational, screening,
                    and research purposes. It does not replace clinical
                    judgment, diagnostic testing, or professional medical
                    advice.
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onGetStarted}
                className="mt-10 inline-flex w-fit items-center gap-3 rounded-2xl bg-cyan-500 px-7 py-4 font-semibold text-slate-950 shadow-lg transition hover:bg-cyan-400"
              >
                Get Started

                <ArrowRight size={20} />
              </motion.button>
            </div>

            {/* Right Section */}
            <div className="relative overflow-hidden border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900">
              {/* Decorative Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-red-500/5" />

              <div className="relative flex h-full min-h-[420px] items-center justify-center p-10">
                <div className="w-full max-w-md">
                  {/* ECG Placeholder Card */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-3xl border border-slate-800 bg-slate-950/70 p-8 shadow-xl"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <Activity
                        className="text-cyan-400"
                        size={28}
                      />

                      <h2 className="text-xl font-semibold text-white">
                        ECG Monitoring Preview
                      </h2>
                    </div>

                    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-6">
                      {/* ECG Placeholder */}
                      <svg
                        viewBox="0 0 500 120"
                        className="w-full"
                        fill="none"
                      >
                        <path
                          d="
                            M0 60
                            L40 60
                            L55 60
                            L70 40
                            L85 90
                            L100 20
                            L115 60
                            L170 60
                            L185 60
                            L200 45
                            L215 85
                            L230 25
                            L245 60
                            L300 60
                            L315 60
                            L330 42
                            L345 88
                            L360 22
                            L375 60
                            L500 60
                          "
                          stroke="#22d3ee"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                      <p className="mt-5 text-center text-sm text-slate-400">
                        Placeholder visualization for future ECG integration
                      </p>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          Assessment
                        </p>

                        <p className="mt-2 font-semibold text-cyan-400">
                          Structured Input
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          Workflow
                        </p>

                        <p className="mt-2 font-semibold text-red-400">
                          Early Referral
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default IntroPage;
