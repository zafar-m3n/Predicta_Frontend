import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Select from "react-select";
import countryList from "react-select-country-list";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import IconComponent from "@/components/ui/Icon";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import Spinner from "@/components/ui/Spinner";

countries.registerLocale(enLocale);

const schema = Yup.object().shape({
  full_name: Yup.string().required("Full name is required"),
  phone_number: Yup.string().required("Phone number is required"),
  country_code: Yup.string().required("Country is required"),
});

const ProfileForm = () => {
  const options = useMemo(() => countryList().getData(), []);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
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
    const fetchProfile = async () => {
      try {
        const res = await API.private.getProfile();
        if (res.status === 200 && res.data.code === "OK") {
          const userData = res.data.data.user;
          setUser(userData);
          reset({
            full_name: userData.full_name,
            phone_number: userData.phone_number,
            country_code: userData.country_code,
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

  const formatPhoneNumber = (number) => {
    if (!number) return "-";
    try {
      const phoneNumber = parsePhoneNumberFromString(number);
      if (!phoneNumber) return number;
      return phoneNumber.formatInternational();
    } catch {
      return number;
    }
  };

  const getCountryName = (code) => {
    if (!code) return "-";
    const name = countries.getName(code, "en", { select: "official" });
    return name || code;
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await API.private.updateProfile(data);
      if (res.status === 200 && res.data.code === "OK") {
        Notification.success(res.data.data.message || "Profile updated successfully!");
        setUser({
          ...data,
          email: user.email,
        });
        setIsEditing(false);
      }
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

  if (isLoading) {
    return (
      <>
        <Spinner />
        <p className="text-gray-500 mt-4">Loading profile...</p>
      </>
    );
  }

  if (!user) return <div>No user data available.</div>;

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100 w-full max-w-lg mx-auto text-center">
      <div className="flex justify-center mb-4">
        <IconComponent icon="mdi:account-circle" width="80" className="text-gray-300" />
      </div>

      <h2 className="text-2xl font-bold mb-6 text-accent">Profile Information</h2>

      {!isEditing ? (
        <>
          <div className="space-y-6 text-left">
            <div>
              <p className="text-gray-500 text-sm uppercase">Full Name</p>
              <p className="text-gray-900 font-semibold text-lg">{user.full_name || "-"}</p>
              <div className="border-b border-gray-200 mt-2" />
            </div>
            <div>
              <p className="text-gray-500 text-sm uppercase">Email</p>
              <p className="text-gray-900 font-semibold text-lg">{user.email || "-"}</p>
              <div className="border-b border-gray-200 mt-2" />
            </div>
            <div>
              <p className="text-gray-500 text-sm uppercase">Phone Number</p>
              <p className="text-gray-900 font-semibold text-lg">{formatPhoneNumber(user.phone_number)}</p>
              <div className="border-b border-gray-200 mt-2" />
            </div>
            <div>
              <p className="text-gray-500 text-sm uppercase">Country</p>
              <p className="text-gray-900 font-semibold text-lg">{getCountryName(user.country_code)}</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-accent text-white py-2 rounded font-semibold mt-6 hover:bg-accent/90 transition"
          >
            Edit Profile
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              {...register("full_name")}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-accent ${
                errors.full_name ? "border-red-500" : "border-gray-300"
              }`}
            />
            <p className="text-red-500 text-sm">{errors.full_name?.message}</p>
          </div>

          <div>
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

          <div>
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

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-accent text-white py-2 rounded font-semibold flex items-center justify-center transition ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-accent/90"
            }`}
          >
            {isSubmitting ? <Spinner color="white" /> : "Save Changes"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ProfileForm;
