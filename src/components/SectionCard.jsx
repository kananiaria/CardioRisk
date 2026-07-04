import { motion } from "framer-motion";

function SectionCard({
  title,
  subtitle,
  icon: Icon,
  children,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="
        rounded-3xl
        border
        border-slate-800
        bg-slate-900
        shadow-xl
        overflow-hidden
      "
    >
      {/* Header */}
      <div className="border-b border-slate-800 px-6 py-5">
        <div className="flex items-start gap-4">
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              border
              border-cyan-500/20
              bg-cyan-500/10
            "
          >
            {Icon && (
              <Icon
                size={24}
                className="text-cyan-400"
              />
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">
              {title}
            </h2>

            {subtitle && (
              <p className="mt-1 text-sm text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {children}
      </div>
    </motion.div>
  );
}

export default SectionCard;
