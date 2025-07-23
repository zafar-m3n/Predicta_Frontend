import React, { useEffect, useMemo, useState, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import countryList from "react-select-country-list";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import IconComponent from "@/components/ui/Icon";
import Spinner from "@/components/ui/Spinner";
import Heading from "@/components/ui/Heading";

import TextInput from "@/components/form/TextInput";
import PhoneInput from "@/components/form/PhoneInput";
import Select from "@/components/form/Select";
import AccentButton from "@/components/ui/AccentButton";
import GrayButton from "@/components/ui/GrayButton";

import { ThemeContext } from "@/context/ThemeContext";

countries.registerLocale(enLocale);

const schema = Yup.object().shape({
  full_name: Yup.string().required("Full name is required"),
  phone_number: Yup.string().required("Phone number is required"),
  country_code: Yup.string().required("Country is required"),
});

const ProfileForm = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

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
      } catch {
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
      return phoneNumber ? phoneNumber.formatInternational() : number;
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
      const msg = error.response?.data?.message || "Something went wrong. Please try again.";
      Notification.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Spinner message="Loading profile..." />;
  }

  if (!user) {
    return <div className="text-gray-700 dark:text-gray-300">No user data available.</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 border border-gray-100 dark:border-gray-700 w-full max-w-lg mx-auto text-center">
      <div className="flex justify-center mb-4">
        <IconComponent icon="mdi:account-circle" width="80" className="text-gray-300 dark:text-gray-600" />
      </div>
      <Heading className="mb-6" accented>
        Profile Information
      </Heading>

      {!isEditing ? (
        <>
          <div className="space-y-6 text-left">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm uppercase">Full Name</p>
              <p className="text-gray-900 dark:text-gray-100 font-semibold text-lg">{user.full_name || "-"}</p>
              <div className="border-b border-gray-200 dark:border-gray-700 mt-2" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm uppercase">Email</p>
              <p className="text-gray-900 dark:text-gray-100 font-semibold text-lg">{user.email || "-"}</p>
              <div className="border-b border-gray-200 dark:border-gray-700 mt-2" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm uppercase">Phone Number</p>
              <p className="text-gray-900 dark:text-gray-100 font-semibold text-lg">
                {formatPhoneNumber(user.phone_number)}
              </p>
              <div className="border-b border-gray-200 dark:border-gray-700 mt-2" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm uppercase">Country</p>
              <p className="text-gray-900 dark:text-gray-100 font-semibold text-lg">
                {getCountryName(user.country_code)}
              </p>
              <div className="border-b border-gray-200 dark:border-gray-700 mt-2" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm uppercase">Promo Code</p>
              <p className="text-gray-900 dark:text-gray-100 font-semibold text-lg">{user.promo_code || "N/A"}</p>
            </div>
          </div>

          <AccentButton onClick={() => setIsEditing(true)} text="Edit Profile" className="mt-6" />
        </>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left mt-6">
          <TextInput
            label="Full Name"
            placeholder="Enter your name"
            error={errors.full_name?.message}
            {...register("full_name")}
          />

          <Controller
            name="country_code"
            control={control}
            render={({ field }) => (
              <Select
                label="Country"
                options={options}
                value={field.value}
                onChange={(val) => field.onChange(val)}
                error={errors.country_code?.message}
              />
            )}
          />

          <Controller
            name="phone_number"
            control={control}
            render={({ field }) => (
              <PhoneInput
                label="Phone Number"
                value={field.value}
                onChange={(val) => {
                  field.onChange(val);
                  setValue("phone_number", val, { shouldValidate: true });
                }}
                error={errors.phone_number?.message}
              />
            )}
          />

          <AccentButton type="submit" loading={isSubmitting} text="Save Changes" spinner={<Spinner color="white" />} />

          <GrayButton
            type="button"
            text="Cancel"
            onClick={() => {
              setIsEditing(false);
              reset({
                full_name: user.full_name,
                phone_number: user.phone_number,
                country_code: user.country_code,
              });
            }}
          />
        </form>
      )}
    </div>
  );
};

export default ProfileForm;
