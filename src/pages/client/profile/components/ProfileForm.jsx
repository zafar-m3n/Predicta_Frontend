import React, { useEffect, useState } from "react";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);

const ProfileForm = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.private.getProfile();
        if (res.status === 200) {
          setUser(res.data.user);
        }
      } catch (error) {
        Notification.error("Failed to fetch profile data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

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

  if (isLoading) return <div>Loading profile...</div>;
  if (!user) return <div>No user data available.</div>;

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100 w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-accent">Profile Information</h2>

      <div className="space-y-6">
        {/* Full Name */}
        <div>
          <p className="text-gray-500 text-sm uppercase">Full Name</p>
          <p className="text-gray-900 font-semibold text-lg">{user.full_name || "-"}</p>
          <div className="border-b border-gray-200 mt-2" />
        </div>

        {/* Email */}
        <div>
          <p className="text-gray-500 text-sm uppercase">Email</p>
          <p className="text-gray-900 font-semibold text-lg">{user.email || "-"}</p>
          <div className="border-b border-gray-200 mt-2" />
        </div>

        {/* Phone Number */}
        <div>
          <p className="text-gray-500 text-sm uppercase">Phone Number</p>
          <p className="text-gray-900 font-semibold text-lg">{formatPhoneNumber(user.phone_number)}</p>
          <div className="border-b border-gray-200 mt-2" />
        </div>

        {/* Country */}
        <div>
          <p className="text-gray-500 text-sm uppercase">Country</p>
          <p className="text-gray-900 font-semibold text-lg">{getCountryName(user.country_code)}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
