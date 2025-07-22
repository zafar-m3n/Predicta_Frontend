import React, { useState, useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Select from "react-select";
import countryList from "react-select-country-list";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import Notification from "@/components/ui/Notification";
import Spinner from "@/components/ui/Spinner";

const roleOptions = [
  { value: "client", label: "Client" },
  { value: "admin", label: "Admin" },
];

const schema = Yup.object().shape({
  full_name: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  phone_number: Yup.string().required("Phone number is required"),
  country_code: Yup.string().required("Country is required"),
  role: Yup.string().oneOf(["client", "admin"], "Invalid role").required("Role is required"),
  password: Yup.string(),
  promo_code: Yup.string().nullable(),
});

const UserFormModal = ({ onSubmit, onClose, initialData, isEdit }) => {
  const options = useMemo(() => countryList().getData(), []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const countryCode = watch("country_code");

  useEffect(() => {
    if (initialData) {
      reset({
        full_name: initialData.full_name || "",
        email: initialData.email || "",
        phone_number: initialData.phone_number || "",
        country_code: initialData.country_code || "",
        role: initialData.role || "client",
        password: "",
        promo_code: initialData.promo_code || "",
      });
    } else {
      reset({
        full_name: "",
        email: "",
        phone_number: "",
        country_code: "",
        role: "client",
        password: "",
        promo_code: "",
      });
    }
  }, [initialData, reset]);

  const submitHandler = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await onSubmit(data);
      if (res?.status === 200 && res.data?.code === "OK") {
        Notification.success(`User ${isEdit ? "updated" : "created"} successfully.`);
        onClose();
      } else {
        const msg = res?.data?.error || "Unexpected error occurred.";
        Notification.error(msg);
      }
    } catch (error) {
      let msg = "Something went wrong. Please try again.";
      if (error.response?.data?.error) {
        msg = error.response.data.error;
      }
      Notification.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectStyles = (hasError) => ({
    control: (base) => ({
      ...base,
      backgroundColor: "#fff",
      borderColor: hasError ? "#f87171" : "#d1d5db",
      color: "#111827",
      boxShadow: "none",
    }),
    singleValue: (base) => ({ ...base, color: "#111827" }),
    menu: (base) => ({ ...base, backgroundColor: "#fff", color: "#111827", zIndex: 50 }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected ? "#2563eb" : isFocused ? "#f3f4f6" : "#fff",
      color: "#111827",
      cursor: "pointer",
    }),
    placeholder: (base) => ({ ...base, color: "#6b7280" }),
  });

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4 text-left">
      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Full Name</label>
        <Controller
          name="full_name"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              placeholder="Enter full name"
              className={`w-full border rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-accent ${
                errors.full_name ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            />
          )}
        />
        <p className="text-red-500 text-sm">{errors.full_name?.message}</p>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email</label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="email"
              placeholder="Enter email"
              className={`w-full border rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-accent ${
                errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            />
          )}
        />
        <p className="text-red-500 text-sm">{errors.email?.message}</p>
      </div>

      {/* Country and Phone Row */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Country</label>
          <Controller
            name="country_code"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={options}
                placeholder="Select Country"
                value={options.find((opt) => opt.value === countryCode) || null}
                onChange={(selected) => field.onChange(selected ? selected.value : "")}
                classNamePrefix="react-select"
                styles={selectStyles(!!errors.country_code)}
              />
            )}
          />
          <p className="text-red-500 text-sm">{errors.country_code?.message}</p>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Phone Number</label>
          <Controller
            name="phone_number"
            control={control}
            render={({ field }) => (
              <PhoneInput
                defaultCountry="GB"
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  setValue("phone_number", value, { shouldValidate: true });
                }}
                className={`w-full ${errors.phone_number ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
                inputClassName="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-accent"
              />
            )}
          />
          <p className="text-red-500 text-sm">{errors.phone_number?.message}</p>
        </div>
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Role</label>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={roleOptions}
              placeholder="Select role..."
              onChange={(option) => field.onChange(option?.value || "")}
              value={roleOptions.find((opt) => opt.value === field.value) || null}
              classNamePrefix="react-select"
              styles={selectStyles(!!errors.role)}
            />
          )}
        />
        <p className="text-red-500 text-sm">{errors.role?.message}</p>
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          {isEdit ? "New Password (optional)" : "Password"}
        </label>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="password"
              placeholder={isEdit ? "Leave blank to keep current" : "Enter password"}
              className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-accent border-gray-300 dark:border-gray-600"
            />
          )}
        />
        <p className="text-red-500 text-sm">{errors.password?.message}</p>
      </div>

      {/* Promo Code */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Promo Code (optional)</label>
        <Controller
          name="promo_code"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              placeholder="Enter promo code"
              className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-accent border-gray-300 dark:border-gray-600"
            />
          )}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-accent text-white py-2 rounded font-semibold transition ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-accent/90"
        }`}
      >
        {isSubmitting ? <Spinner color="white" /> : isEdit ? "Update User" : "Create User"}
      </button>
    </form>
  );
};

export default UserFormModal;
