import React, { useState } from "react";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import Spinner from "@/components/ui/Spinner";

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

  const inputClass =
    "w-full border rounded px-3 py-2 focus:outline-none focus:border-accent border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100";

  return (
    <form onSubmit={onSubmit} className="space-y-3 bg-white dark:bg-gray-900 rounded-2xl p-1">
      {type === "bank" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bank Name</label>
            <input
              type="text"
              placeholder="Enter bank name"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Branch</label>
            <input
              type="text"
              placeholder="Enter branch"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Number</label>
            <input
              type="text"
              placeholder="Enter account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Name</label>
            <input
              type="text"
              placeholder="Enter account name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SWIFT Code</label>
              <input
                type="text"
                placeholder="Enter SWIFT code"
                value={swiftCode}
                onChange={(e) => setSwiftCode(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">IBAN</label>
              <input
                type="text"
                placeholder="Enter IBAN"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </>
      )}

      {type === "crypto" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Network</label>
            <input
              type="text"
              placeholder="Enter network (e.g., ERC20)"
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Wallet Address</label>
            <input
              type="text"
              placeholder="Enter wallet address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className={inputClass}
            />
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-accent text-white py-2 rounded font-semibold shadow transition-all ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-accent/90"
        }`}
      >
        {isSubmitting ? <Spinner color="white" /> : "Add Method"}
      </button>
    </form>
  );
};

export default AddWithdrawalMethodForm;
