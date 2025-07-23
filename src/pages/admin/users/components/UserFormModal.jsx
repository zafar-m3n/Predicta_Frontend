import React, { useMemo, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import countryList from "react-select-country-list";
import libphonenumber from "google-libphonenumber";

import TextInput from "@/components/form/TextInput";
import Select from "@/components/form/Select";
import PhoneInput from "@/components/form/PhoneInput";
import AccentButton from "@/components/ui/AccentButton";
import Spinner from "@/components/ui/Spinner";
import Notification from "@/components/ui/Notification";

const schema = Yup.object().shape({
  full_name: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone_number: Yup.string().required("Phone number is required"),
  country_code: Yup.string().required("Country is required"),
  role: Yup.string().oneOf(["client", "admin"], "Invalid role").required("Role is required"),
  password: Yup.string(),
  promo_code: Yup.string(),
});

const roleOptions = [
  { value: "client", label: "Client" },
  { value: "admin", label: "Admin" },
];

const UserFormModal = ({ onSubmit, onClose, initialData = null, isEdit = false }) => {
  const options = useMemo(() => countryList().getData(), []);
  const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

  const [phoneError, setPhoneError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const selectedCountryCode = watch("country_code");

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
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data) => {
    const isValidForm = await trigger();
    if (!isValidForm) {
      setPhoneError("");
      return;
    }

    try {
      const parsedNumber = phoneUtil.parseAndKeepRawInput(data.phone_number);
      if (!phoneUtil.isValidNumber(parsedNumber)) {
        setPhoneError("Invalid phone number");
        return;
      }
    } catch {
      setPhoneError("Invalid phone number");
      return;
    }

    setPhoneError("");
    setIsSubmitting(true);

    try {
      const payload = {
        full_name: data.full_name,
        email: data.email,
        phone_number: data.phone_number,
        country_code: data.country_code,
        role: data.role,
        password: data.password || undefined,
        promo_code: data.promo_code || null,
      };

      const res = await onSubmit(payload);

      if (res?.status === 200 && res.data?.code === "OK") {
        Notification.success(`User ${isEdit ? "updated" : "created"} successfully.`);
        onClose();
      } else {
        Notification.error(res?.data?.error || "Unexpected response from server.");
      }
    } catch (error) {
      const status = error.response?.status;
      let msg = "Something went wrong.";
      if (status === 400) msg = error.response?.data?.error || "Bad Request.";
      else if (status === 500) msg = "Server error.";
      Notification.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 text-left">
      <TextInput
        placeholder="Enter User's Fullname"
        {...register("full_name")}
        error={errors.full_name?.message}
        label="Full Name"
      />

      <TextInput
        type="email"
        placeholder="Enter Email Address"
        {...register("email")}
        error={errors.email?.message}
        label="Email"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="country_code"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onChange={(value) => field.onChange(value)}
              options={options}
              placeholder="Select Country"
              error={errors.country_code?.message}
              label="Country"
            />
          )}
        />

        <Controller
          name="phone_number"
          control={control}
          render={({ field }) => (
            <PhoneInput
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                setValue("phone_number", value, { shouldValidate: true });
                setPhoneError("");
              }}
              error={errors.phone_number?.message || phoneError}
              label="Phone Number"
            />
          )}
        />
      </div>

      <TextInput
        type="password"
        placeholder={isEdit ? "Leave blank for same password" : "Enter New Password"}
        {...register("password")}
        error={errors.password?.message}
        label={isEdit ? "New Password (optional)" : "Password"}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onChange={(value) => field.onChange(value)}
              options={roleOptions}
              placeholder="Select Role"
              error={errors.role?.message}
              label="Role"
            />
          )}
        />
        <TextInput placeholder="Enter the Promo Code" {...register("promo_code")} label="Promo Code (Optional)" />
      </div>

      <AccentButton
        type="submit"
        loading={isSubmitting}
        text={isEdit ? "Update User" : "Create User"}
        spinner={<Spinner color="white" />}
      />
    </form>
  );
};

export default UserFormModal;
