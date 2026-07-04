function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  acceptedRange = "",
  options = [],
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-slate-200">
          {label}
        </label>

        {acceptedRange && (
          <span className="text-xs text-slate-400">
            Accepted Range: {acceptedRange}
          </span>
        )}
      </div>

      {type === "select" ? (
        <select
          value={value}
          onChange={onChange}
          className="
            w-full
            rounded-2xl
            border
            border-slate-700
            bg-slate-950
            px-4
            py-3
            text-slate-100
            outline-none
            transition-all
            duration-200
            focus:border-cyan-500
            focus:ring-2
            focus:ring-cyan-500/20
          "
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-slate-950 text-slate-100"
            >
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="
            w-full
            rounded-2xl
            border
            border-slate-700
            bg-slate-950
            px-4
            py-3
            text-slate-100
            placeholder:text-slate-500
            outline-none
            transition-all
            duration-200
            focus:border-cyan-500
            focus:ring-2
            focus:ring-cyan-500/20
          "
        />
      )}
    </div>
  );
}

export default InputField;
