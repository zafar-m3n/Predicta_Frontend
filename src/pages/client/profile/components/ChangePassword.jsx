import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import Spinner from "@/components/ui/Spinner";
import Heading from "@/components/ui/Heading";

import TextInput from "@/components/form/TextInput";
import AccentButton from "@/components/ui/AccentButton";

const schema = Yup.object().shape({
  current_password: Yup.string().required("Current password is required"),
  new_password: Yup.string().min(6, "Minimum 6 characters").required("New password is required"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("new_password"), null], "Passwords must match")
    .required("Please confirm your new password"),
});

const ChangePasswordForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await API.private.changePassword({
        current_password: data.current_password,
        new_password: data.new_password,
      });

      if (res.data.code === "OK") {
        Notification.success(res.data.data.message || "Password changed successfully!");
        reset();
      } else {
        const msg = res.data.error || "Failed to change password.";
        Notification.error(msg);
      }
    } catch (error) {
      const msg = error.response?.data?.error || "Something went wrong. Please try again.";
      Notification.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-100 dark:border-gray-700 w-full">
      <Heading className="mb-4">Change Password</Heading>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextInput
          label="Current Password"
          type="password"
          placeholder="Enter current password"
          error={errors.current_password?.message}
          {...register("current_password")}
        />

        <TextInput
          label="New Password"
          type="password"
          placeholder="Enter new password"
          error={errors.new_password?.message}
          {...register("new_password")}
        />

        <TextInput
          label="Confirm New Password"
          type="password"
          placeholder="Re-enter new password"
          error={errors.confirm_password?.message}
          {...register("confirm_password")}
        />

        <AccentButton type="submit" text="Change Password" loading={isSubmitting} spinner={<Spinner color="white" />} />
      </form>
    </div>
  );
};

export default ChangePasswordForm;
