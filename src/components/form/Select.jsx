import React, { useContext } from "react";
import SelectLib from "react-select";
import { ThemeContext } from "@/context/ThemeContext";

const Select = ({ value, onChange, options = [], placeholder = "Select", error, label, ...rest }) => {
  const { theme } = useContext(ThemeContext);

  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: theme === "dark" ? "#101828" : "#fff",
      borderColor: error ? "#f87171" : state.isFocused ? "#309f6d" : theme === "dark" ? "#4b5563" : "#d1d5db",
      boxShadow: "none",
      color: theme === "dark" ? "#f3f4f6" : "#111827",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: theme === "dark" ? "#101828" : "#fff",
      color: theme === "dark" ? "#f3f4f6" : "#111827",
      zIndex: 50,
    }),
    singleValue: (base) => ({
      ...base,
      color: theme === "dark" ? "#f3f4f6" : "#111827",
    }),
    option: (base, { isFocused }) => ({
      ...base,
      backgroundColor: isFocused ? (theme === "dark" ? "#374151" : "#f3f4f6") : theme === "dark" ? "#101828" : "#fff",
      color: theme === "dark" ? "#f3f4f6" : "#111827",
      cursor: "pointer",
    }),
    placeholder: (base) => ({
      ...base,
      color: theme === "dark" ? "#9ca3af" : "#6b7280",
    }),
  };

  return (
    <div className="w-full">
      {label && <label className="block mb-1 text-sm font-medium text-gray-800 dark:text-gray-200">{label}</label>}
      <SelectLib
        options={options}
        value={options.find((opt) => opt.value === value) || null}
        onChange={(selected) => onChange(selected?.value || "")}
        placeholder={placeholder}
        styles={customStyles}
        classNamePrefix="react-select"
        {...rest}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Select;
