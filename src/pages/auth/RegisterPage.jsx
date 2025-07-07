import React, { useMemo } from "react";
import AuthLayout from "@/layouts/AuthLayout";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Select from "react-select";
import countryList from "react-select-country-list";

const schema = Yup.object().shape({
  full_name: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone_number: Yup.string().required("Phone number is required"),
  country_code: Yup.string().required("Country is required"),
  password: Yup.string().min(6, "Minimum 6 characters").required("Password is required"),
});

const RegisterPage = () => {
  const options = useMemo(() => countryList().getData(), []);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("Form data:", data);
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
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <p className="text-red-500 text-sm">{errors.full_name?.message}</p>
          </div>

          <div>
            <input
              type="email"
              placeholder="Enter Your Email"
              {...register("email")}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
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
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderColor: errors.country_code ? "red" : "#d1d5db",
                      borderRadius: "0.375rem",
                      minHeight: "2.5rem",
                      boxShadow: state.isFocused ? "0 0 0 2px #86efac" : "none",
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
            <input
              type="text"
              placeholder="Mobile number"
              {...register("phone_number")}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <p className="text-red-500 text-sm">{errors.phone_number?.message}</p>
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <p className="text-red-500 text-sm">{errors.password?.message}</p>
          </div>

          <p className="text-center text-xs text-gray-500">
            By registering you agree to our <span className="text-accent cursor-pointer">Privacy Policy</span>,{" "}
            <span className="text-accent cursor-pointer">Terms of Use</span>
          </p>

          <button
            type="submit"
            className="w-full bg-accent text-white py-2 rounded font-semibold hover:bg-accent/90 transition"
          >
            Register with EquityFX
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
