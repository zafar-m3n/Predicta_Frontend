import React, { useState } from "react";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import Spinner from "@/components/ui/Spinner";

import TextInput from "@/components/form/TextInput";
import AccentButton from "@/components/ui/AccentButton";

const AddWithdrawalMethodForm = ({ type, onSuccess, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for each field
  const [bankName, setBankName] = useState("");
  const [branch, setBranch] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [iban, setIban] = useState("");
  const [network, setNetwork] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    let payload = { type };

    if (type === "bank") {
      if (!bankName || !branch || !accountNumber || !accountName || !swiftCode || !iban) {
        Notification.error("Please fill in all required bank fields.");
        return;
      }
      payload = {
        ...payload,
        bank_name: bankName,
        branch,
        account_number: accountNumber,
        account_name: accountName,
        swift_code: swiftCode,
        iban,
      };
    }

    if (type === "crypto") {
      if (!network || !walletAddress) {
        Notification.error("Please fill in all required crypto fields.");
        return;
      }
      payload = {
        ...payload,
        network,
        wallet_address: walletAddress,
      };
    }

    setIsSubmitting(true);
    try {
      const res = await API.private.addWithdrawalMethod(payload);
      if (res.data.code === "OK") {
        Notification.success(res.data.data.message || "Withdrawal method added successfully!");
        onSuccess();
        onClose();
      } else {
        const msg = res.data.error || "Failed to add withdrawal method.";
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
    <form onSubmit={onSubmit} className="space-y-4 bg-white dark:bg-gray-900 rounded-2xl">
      {type === "bank" && (
        <>
          <TextInput
            label="Bank Name"
            placeholder="Enter bank name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
          />

          <TextInput
            label="Branch"
            placeholder="Enter branch"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          />

          <TextInput
            label="Account Number"
            placeholder="Enter account number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />

          <TextInput
            label="Account Name"
            placeholder="Enter account name"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="SWIFT Code"
              placeholder="Enter SWIFT code"
              value={swiftCode}
              onChange={(e) => setSwiftCode(e.target.value)}
            />

            <TextInput label="IBAN" placeholder="Enter IBAN" value={iban} onChange={(e) => setIban(e.target.value)} />
          </div>
        </>
      )}

      {type === "crypto" && (
        <>
          <TextInput
            label="Network"
            placeholder="Enter network (e.g., ERC20)"
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
          />

          <TextInput
            label="Wallet Address"
            placeholder="Enter wallet address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
        </>
      )}

      <AccentButton type="submit" text="Add Method" loading={isSubmitting} spinner={<Spinner color="white" />} />
    </form>
  );
};

export default AddWithdrawalMethodForm;
