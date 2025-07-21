import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DefaultLayout from "@/layouts/DefaultLayout";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import IconComponent from "@/components/ui/Icon";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import { formatDate } from "@/utils/formatDate";
import Spinner from "@/components/ui/Spinner";

countries.registerLocale(enLocale);
const apiBaseUrl = import.meta.env.VITE_TRADERSROOM_API_BASEURL;

const ViewUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewModal, setPreviewModal] = useState({ open: false, documentPath: "" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.private.getUserById(id);
        if (res.status === 200 && res.data.code === "OK") {
          setUser(res.data.data.user);
        }
      } catch (error) {
        Notification.error("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

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

  const getDocumentLabel = (type) => {
    switch (type) {
      case "id_card":
        return "ID Card";
      case "drivers_license":
        return "Driver's License";
      case "utility_bill":
        return "Utility Bill";
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <DefaultLayout>
        <Spinner />
        <p className="text-center text-gray-500 dark:text-gray-400 mt-4">Loading user...</p>
      </DefaultLayout>
    );
  }

  if (!user) {
    return (
      <DefaultLayout>
        <div className="text-gray-500 dark:text-gray-400 text-center py-10">No user data found.</div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="py-5">
        <div className="grid grid-cols-1 xl:grid-cols-3 grid-rows-2 space-y-6 md:space-y-0 md:gap-6 max-w-7xl mx-auto">
          {/* Profile Card */}
          <div className="row-span-2 bg-white dark:bg-gray-900 dark:border-gray-800 shadow-xl rounded-2xl p-6 border border-gray-100 flex flex-col space-y-6 text-center">
            <div className="flex justify-center mb-4">
              <IconComponent icon="mdi:account-circle" width="80" className="text-gray-300 dark:text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold mb-6 text-accent">Profile Information</h2>
            <div className="space-y-6 text-left">
              {[
                { label: "Full Name", value: user.full_name },
                { label: "Email", value: user.email },
                { label: "Phone Number", value: formatPhoneNumber(user.phone_number) },
                { label: "Country", value: getCountryName(user.country_code) },
                { label: "Promo Code", value: user.promo_code || "-" },
              ].map((field, i) => (
                <div key={i}>
                  <p className="text-gray-500 dark:text-gray-400 text-sm uppercase">{field.label}</p>
                  <p className="text-gray-900 dark:text-gray-100 font-semibold text-lg">{field.value}</p>
                  <div className="border-b border-gray-200 dark:border-gray-700 mt-2" />
                </div>
              ))}
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm uppercase">Role</p>
                <Badge text={user.role} color={user.role === "admin" ? "blue" : "gray"} />
                <div className="border-b border-gray-200 dark:border-gray-700 mt-2" />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm uppercase">Email Verified</p>
                <Badge
                  text={user.email_verified ? "Verified" : "Not Verified"}
                  color={user.email_verified ? "green" : "red"}
                />
              </div>
            </div>
          </div>

          {/* KYC Documents */}
          <div className="col-span-2 bg-white dark:bg-gray-900 dark:border-gray-800 shadow-xl rounded-2xl p-6 border border-gray-100 overflow-x-auto space-y-6">
            <h2 className="text-xl font-bold text-accent">KYC Documents</h2>
            <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {["Type", "Status", "Submitted", "Note", "Actions"].map((header) => (
                    <th
                      key={header}
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {user.KycDocuments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                      No documents found.
                    </td>
                  </tr>
                ) : (
                  user.KycDocuments.map((doc) => (
                    <tr key={doc.id}>
                      <td className="px-4 py-2 text-gray-700 dark:text-white">{getDocumentLabel(doc.document_type)}</td>
                      <td className="px-4 py-2">
                        <Badge
                          text={doc.status}
                          color={doc.status === "approved" ? "green" : doc.status === "rejected" ? "red" : "yellow"}
                          size="sm"
                        />
                      </td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{formatDate(doc.submitted_at)}</td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{doc.admin_note || "N/A"}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => setPreviewModal({ open: true, documentPath: doc.document_path })}
                          className="inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                          <IconComponent icon="mdi:eye" width="18" className="text-gray-700 dark:text-gray-300" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Withdrawal Details */}
          <div className="col-span-2 bg-white dark:bg-gray-900 dark:border-gray-800 shadow-xl rounded-2xl p-6 border border-gray-100 space-y-6">
            <h2 className="text-xl font-bold text-accent">Withdrawal Details</h2>
            {user.WithdrawalMethods?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.WithdrawalMethods.map((method) => (
                  <div
                    key={method.id}
                    className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-600 dark:text-gray-300 text-sm font-medium uppercase">
                        {method.type === "bank" ? "Bank" : "Crypto"}
                      </p>
                      <Badge text={method.status} color={method.status === "active" ? "green" : "gray"} />
                    </div>
                    <div className="space-y-1 text-gray-800 dark:text-gray-100 text-sm">
                      {method.type === "bank" ? (
                        <>
                          <p>
                            <strong>Bank:</strong> {method.bank_name}
                          </p>
                          <p>
                            <strong>Branch:</strong> {method.branch}
                          </p>
                          <p>
                            <strong>Account #:</strong> {method.account_number}
                          </p>
                          <p>
                            <strong>Account Name:</strong> {method.account_name}
                          </p>
                          <p>
                            <strong>SWIFT:</strong> {method.swift_code}
                          </p>
                          <p>
                            <strong>IBAN:</strong> {method.iban}
                          </p>
                        </>
                      ) : (
                        <>
                          <p>
                            <strong>Network:</strong> {method.network}
                          </p>
                          <p>
                            <strong>Wallet Address:</strong> {method.wallet_address}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No withdrawal details added.</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={previewModal.open}
        onClose={() => setPreviewModal({ open: false, documentPath: "" })}
        title="KYC Document Preview"
        size="md"
        centered
      >
        <div className="flex justify-center items-center">
          {previewModal.documentPath ? (
            <img
              src={`${apiBaseUrl}/${previewModal.documentPath.replace(/\\/g, "/")}`}
              alt="KYC Document"
              className="max-w-full max-h-[500px] rounded shadow"
            />
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No document available.</p>
          )}
        </div>
      </Modal>
    </DefaultLayout>
  );
};

export default ViewUser;
