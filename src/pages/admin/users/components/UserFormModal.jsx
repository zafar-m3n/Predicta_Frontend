import React, { useState, useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Select from "react-select";
import countryList from "react-select-country-list";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import Notification from "@/components/ui/Notification";

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
      });
    } else {
      reset({
        full_name: "",
        email: "",
        phone_number: "",
        country_code: "",
        role: "client",
        password: "",
      });
    }
  }, [initialData, reset]);

  const submitHandler = async (data) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      Notification.success(`User ${isEdit ? "updated" : "created"} successfully.`);
      onClose();
    } catch (error) {
      let msg = "Something went wrong. Please try again.";
      if (error.response?.data?.message) {
        msg = error.response.data.message;
      }
      Notification.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4 text-left">
      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <Controller
          name="full_name"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              placeholder="Enter full name"
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-accent ${
                errors.full_name ? "border-red-500" : "border-gray-300"
              }`}
            />
          )}
        />
        <p className="text-red-500 text-sm">{errors.full_name?.message}</p>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="email"
              placeholder="Enter email"
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-accent ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
          )}
        />
        <p className="text-red-500 text-sm">{errors.email?.message}</p>
      </div>

      {/* Country and Phone Row */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
          <Controller
            name="country_code"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={options}
                placeholder="Select Country"
                value={options.find((opt) => opt.value === countryCode) || null}
                onChange={(selected) => {
                  field.onChange(selected ? selected.value : "");
                }}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            )}
          />
          <p className="text-red-500 text-sm">{errors.country_code?.message}</p>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
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
                className={`w-full ${errors.phone_number ? "border-red-500" : "border-gray-300"}`}
                inputClassName="w-full border rounded px-3 py-2 focus:outline-none focus:border-accent"
              />
            )}
          />
          <p className="text-red-500 text-sm">{errors.phone_number?.message}</p>
        </div>
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={roleOptions}
              placeholder="Select role..."
              onChange={(option) => field.onChange(option.value)}
              value={roleOptions.find((opt) => opt.value === field.value) || null}
              classNamePrefix="react-select"
            />
          )}
        />
        <p className="text-red-500 text-sm">{errors.role?.message}</p>
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
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
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-accent"
            />
          )}
        />
        <p className="text-red-500 text-sm">{errors.password?.message}</p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-accent text-white py-2 rounded font-semibold transition ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-accent/90"
        }`}
      >
        {isSubmitting ? (isEdit ? "Updating..." : "Creating...") : isEdit ? "Update User" : "Create User"}
      </button>
    </form>
  );
};

export default UserFormModal;
