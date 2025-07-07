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

const schema = Yup.object().shape({
  full_name: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone_number: Yup.string().required("Phone number is required"),
  country_code: Yup.string().required("Country is required"),
  password: Yup.string().min(6, "Minimum 6 characters").required("Password is required"),
});

const RegisterPage = () => {
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
      };

      const res = await API.private.registerUser(payload);

      if (res.status === 201) {
        Notification.success(
          res.data.message || "Registration successful! Please check your email to verify your account."
        );
        reset();
      } else {
        Notification.error("Unexpected response from server. Please try again.");
      }
    } catch (error) {
      const status = error.response?.status;
      let msg = "Something went wrong during registration.";

      if (status === 400) {
        msg = error.response?.data?.message || "Email already in use.";
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
      <div className="bg-white shadow-2xl rounded-lg p-6 w-full max-w-md mx-auto border border-gray-100">
        <h1 className="text-2xl font-bold text-center mb-1">
          Register Now & Trade <span className="text-accent">With EQUITYFX</span>
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <input
              type="text"
              placeholder="Enter Your Fullname"
              {...register("full_name")}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-accent ${
                errors.full_name ? "border-red-500" : "border-gray-300"
              }`}
            />
            <p className="text-red-500 text-sm">{errors.full_name?.message}</p>
          </div>

          <div>
            <input
              type="email"
              placeholder="Enter Your Email"
              {...register("email")}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-accent ${
                errors.email ? "border-red-500" : "border-gray-300"
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
                  onChange={(selected) => {
                    field.onChange(selected ? selected.value : "");
                  }}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderColor: errors.country_code ? "red" : state.isFocused ? "#86efac" : "#d1d5db",
                      borderRadius: "0.375rem",
                      minHeight: "2.5rem",
                      boxShadow: "none",
                      "&:hover": {
                        borderColor: "#86efac",
                      },
                    }),
                    input: (base) => ({
                      ...base,
                      margin: 0,
                      padding: 0,
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      paddingLeft: "0.75rem",
                    }),
                    singleValue: (base) => ({
                      ...base,
                      marginLeft: 0,
                    }),
                  }}
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
                  className={`w-full ${errors.phone_number || phoneError ? "border-red-500" : "border-gray-300"}`}
                  inputClassName="w-full border rounded px-3 py-2 focus:outline-none focus:border-accent"
                />
              )}
            />
            <p className="text-red-500 text-sm">{errors.phone_number?.message || phoneError}</p>
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-accent ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            <p className="text-red-500 text-sm">{errors.password?.message}</p>
          </div>

          <p className="text-center text-xs text-gray-500">
            By registering you agree to our <span className="text-accent cursor-pointer">Privacy Policy</span>,{" "}
            <span className="text-accent cursor-pointer">Terms of Use</span>
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-accent text-white py-2 rounded font-semibold transition ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-accent/90"
            }`}
          >
            {isSubmitting ? "Registering..." : "Register with EquityFX"}
          </button>

          <p className="text-center text-sm">
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
