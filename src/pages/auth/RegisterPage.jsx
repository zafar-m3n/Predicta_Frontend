import React, { useMemo, useState } from "react";
import AuthLayout from "@/layouts/AuthLayout";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Select from "react-select";
import countryList from "react-select-country-list";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import libphonenumber from "google-libphonenumber";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import Icon from "@/components/ui/Icon";
import Spinner from "@/components/ui/Spinner";

const schema = Yup.object().shape({
  full_name: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone_number: Yup.string().required("Phone number is required"),
  country_code: Yup.string().required("Country is required"),
  password: Yup.string().min(6, "Minimum 6 characters").required("Password is required"),
  promo_code: Yup.string(),
});

const RegisterPage = () => {
  const options = useMemo(() => countryList().getData(), []);
  const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
  const [phoneError, setPhoneError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const selectedCountryCode = watch("country_code");

  const onSubmit = async (data) => {
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
    } catch (error) {
      setPhoneError("Invalid phone number");
      return;
    }

    setPhoneError("");
    setIsSubmitting(true);

    try {
      const payload = {
        full_name: data.full_name,
        email: data.email,
        password: data.password,
        phone_number: data.phone_number,
        country_code: data.country_code,
        promo_code: data.promo_code || null,
      };

      const res = await API.private.registerUser(payload);

      if (res.data.code === "OK") {
        Notification.success(
          res.data.data?.message || "Registration successful! Please check your email to verify your account."
        );
        reset();
      } else {
        Notification.error(res.data.error || "Unexpected response from server.");
      }
    } catch (error) {
      const status = error.response?.status;
      let msg = "Something went wrong during registration.";

      if (status === 400) {
        msg = error.response?.data?.error || "Email already in use.";
      } else if (status === 500) {
        msg = "Server error. Please try again later.";
      }

      Notification.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-lg p-6 w-full max-w-md mx-auto border border-gray-100 dark:border-gray-700 transition-all duration-300">
        <h1 className="text-2xl font-bold text-center mb-1 text-gray-800 dark:text-white">
          Register Now & Trade <span className="text-accent">With EQUITYFX</span>
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <input
              type="text"
              placeholder="Enter Your Fullname"
              {...register("full_name")}
              className={`w-full bg-white dark:bg-gray-900 border rounded px-3 py-2 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-accent ${
                errors.full_name ? "border-red-500" : "border-gray-300 dark:border-gray-700"
              }`}
            />
            <p className="text-red-500 text-sm">{errors.full_name?.message}</p>
          </div>

          <div>
            <input
              type="email"
              placeholder="Enter Your Email"
              {...register("email")}
              className={`w-full bg-white dark:bg-gray-900 border rounded px-3 py-2 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-accent ${
                errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-700"
              }`}
            />
            <p className="text-red-500 text-sm">{errors.email?.message}</p>
          </div>

          <div>
            <Controller
              name="country_code"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={options}
                  placeholder="Select Country"
                  value={options.find((opt) => opt.value === selectedCountryCode) || null}
                  onChange={(selected) => field.onChange(selected?.value || "")}
                  classNamePrefix="react-select"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: "var(--tw-bg-opacity)" in document.documentElement.style ? "" : "white",
                      borderColor: errors.country_code ? "red" : state.isFocused ? "#86efac" : "#d1d5db",
                      borderRadius: "0.375rem",
                      minHeight: "2.5rem",
                      boxShadow: "none",
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: "#1f2937", // dark:bg-gray-800
                      color: "#f3f4f6", // dark:text-gray-100
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: "inherit",
                    }),
                  }}
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary25: "#d1fae5", // light green highlight
                      primary: "#10b981", // accent
                    },
                  })}
                />
              )}
            />
            <p className="text-red-500 text-sm">{errors.country_code?.message}</p>
          </div>

          <div>
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
                    setPhoneError("");
                  }}
                  className="w-full"
                  inputClassName={`w-full border rounded px-3 py-2 focus:outline-none focus:border-accent bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${
                    errors.phone_number || phoneError ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                  }`}
                />
              )}
            />
            <p className="text-red-500 text-sm">{errors.phone_number?.message || phoneError}</p>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
              className={`w-full bg-white dark:bg-gray-900 border rounded px-3 py-2 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-accent ${
                errors.password ? "border-red-500" : "border-gray-300 dark:border-gray-700"
              }`}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-300"
            >
              <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} width="20" />
            </span>
            <p className="text-red-500 text-sm">{errors.password?.message}</p>
          </div>

          <div>
            <input
              type="text"
              placeholder="Promo Code (Optional)"
              {...register("promo_code")}
              className="w-full bg-white dark:bg-gray-900 border rounded px-3 py-2 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 border-gray-300 dark:border-gray-700 focus:outline-none focus:border-accent"
            />
          </div>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            By registering you agree to our <span className="text-accent cursor-pointer">Privacy Policy</span>,{" "}
            <span className="text-accent cursor-pointer">Terms of Use</span>
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-accent text-white py-2 rounded font-semibold transition ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-accent/90"
            } flex justify-center items-center gap-2`}
          >
            {isSubmitting ? <Spinner color="white" /> : "Register with EquityFX"}
          </button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <a href="/login" className="text-accent font-medium">
              Login
            </a>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
