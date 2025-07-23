import React from "react";
import { PhoneInput as IntlPhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

const PhoneInput = ({ value, onChange, error = "", className = "", ...rest }) => {
  return (
    <div className="w-full">
      <IntlPhoneInput
        defaultCountry="GB"
        value={value}
        onChange={onChange}
        className={`react-international-phone-input-container w-full ${className}`}
        {...rest}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default PhoneInput;
