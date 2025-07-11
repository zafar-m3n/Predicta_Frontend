import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";

const schema = Yup.object().shape({
  full_name: Yup.string().required("Full name is required"),
  phone_number: Yup.string(),
  country_code: Yup.string(),
});

const ProfileForm = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.private.getProfile();
        if (res.status === 200) {
          reset({
            full_name: res.data.user.full_name,
            phone_number: res.data.user.phone_number,
            country_code: res.data.user.country_code,
          });
        }
      } catch (error) {
        Notification.error("Failed to fetch profile data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await API.private.updateProfile(data);
      if (res.status === 200) {
        Notification.success(res.data.message || "Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (error) {
      const status = error.response?.status;
      let msg = "Something went wrong. Please try again.";

      if (status === 400 || status === 404) {
        msg = error.response?.data?.message || "Invalid data provided.";
      } else if (status === 500) {
        msg = "Server error. Please try again later.";
      }

      Notification.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100 w-full">
      <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Full Name"
            {...register("full_name")}
            disabled={!isEditing}
            className={`w-full border rounded px-3 py-2 focus:outline-none ${
              isEditing ? "focus:border-accent" : "bg-gray-100 cursor-not-allowed"
            } ${errors.full_name ? "border-red-500" : "border-gray-300"}`}
          />
          <p className="text-red-500 text-sm">{errors.full_name?.message}</p>
        </div>

        <div>
          <input
            type="text"
            placeholder="Phone Number"
            {...register("phone_number")}
            disabled={!isEditing}
            className={`w-full border rounded px-3 py-2 focus:outline-none ${
              isEditing ? "focus:border-accent" : "bg-gray-100 cursor-not-allowed"
            } ${errors.phone_number ? "border-red-500" : "border-gray-300"}`}
          />
          <p className="text-red-500 text-sm">{errors.phone_number?.message}</p>
        </div>

        <div>
          <input
            type="text"
            placeholder="Country Code"
            {...register("country_code")}
            disabled={!isEditing}
            className={`w-full border rounded px-3 py-2 focus:outline-none ${
              isEditing ? "focus:border-accent" : "bg-gray-100 cursor-not-allowed"
            } ${errors.country_code ? "border-red-500" : "border-gray-300"}`}
          />
          <p className="text-red-500 text-sm">{errors.country_code?.message}</p>
        </div>

        {isEditing ? (
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-accent text-white py-2 rounded font-semibold transition ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-accent/90"
            }`}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="w-full bg-gray-200 text-gray-800 py-2 rounded font-medium hover:bg-gray-300 transition"
          >
            Edit Profile
          </button>
        )}
      </form>
    </div>
  );
};

export default ProfileForm;
