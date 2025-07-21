import React, { useState } from "react";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import Pagination from "@/components/ui/Pagination";
import Modal from "@/components/ui/Modal";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);

const UserTable = ({ users, onEdit, onDelete, onView, currentPage, totalPages, onPageChange }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

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

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      onDelete(userToDelete);
    }
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  return (
    <>
      {/* Desktop table view */}
      <div className="overflow-x-auto rounded shadow hidden md:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Country
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Promo Code
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Verified
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-6 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="odd:bg-gray-50 even:bg-white">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{user.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{user.full_name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {formatPhoneNumber(user.phone_number)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {getCountryName(user.country_code)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <Badge text={user.role} color={user.role === "admin" ? "blue" : "gray"} size="sm" />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{user.promo_code || "N/A"}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <Badge
                      text={user.email_verified ? "Verified" : "Not Verified"}
                      color={user.email_verified ? "green" : "red"}
                      size="sm"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => onView(user)}
                      className="inline-flex items-center px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 transition"
                      title="View"
                    >
                      <Icon icon="mdi:eye" width="18" />
                    </button>
                    <button
                      onClick={() => onEdit(user)}
                      className="inline-flex items-center px-2 py-1 border border-green-300 rounded hover:bg-green-50 transition"
                      title="Edit"
                    >
                      <Icon icon="mdi:pencil" width="18" />
                    </button>
                    <button
                      onClick={() => confirmDelete(user)}
                      className="inline-flex items-center px-2 py-1 border border-red-300 rounded hover:bg-red-50 transition"
                      title="Delete"
                    >
                      <Icon icon="mdi:trash-can" width="18" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile card layout */}
      <div className="md:hidden space-y-4">
        {users.length === 0 ? (
          <div className="p-4 text-center text-gray-500 bg-white rounded shadow">No users found.</div>
        ) : (
          users.map((user) => (
            <div key={user.id} className="bg-white p-4 rounded shadow space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm font-semibold text-gray-700">#{user.id}</div>
                <Badge
                  text={user.email_verified ? "Verified" : "Not Verified"}
                  color={user.email_verified ? "green" : "red"}
                  size="sm"
                />
              </div>
              <div className="text-sm text-gray-700">
                <strong>Name:</strong> {user.full_name}
              </div>
              <div className="text-sm text-gray-700">
                <strong>Email:</strong> {user.email}
              </div>
              <div className="text-sm text-gray-700">
                <strong>Phone:</strong> {formatPhoneNumber(user.phone_number)}
              </div>
              <div className="text-sm text-gray-700">
                <strong>Country:</strong> {getCountryName(user.country_code)}
              </div>
              <div className="text-sm text-gray-700">
                <strong>Role:</strong>{" "}
                <Badge text={user.role} color={user.role === "admin" ? "blue" : "gray"} size="sm" />
              </div>
              <div className="text-sm text-gray-700">
                <strong>Promo Code:</strong> {user.promo_code || "N/A"}
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => onView(user)}
                  className="inline-flex items-center px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 transition text-sm"
                  title="View"
                >
                  <Icon icon="mdi:eye" width="18" className="mr-1" /> View
                </button>
                <button
                  onClick={() => onEdit(user)}
                  className="inline-flex items-center px-2 py-1 border border-green-300 rounded hover:bg-green-50 transition text-sm"
                  title="Edit"
                >
                  <Icon icon="mdi:pencil" width="18" className="mr-1" /> Edit
                </button>
                <button
                  onClick={() => confirmDelete(user)}
                  className="inline-flex items-center px-2 py-1 border border-red-300 rounded hover:bg-red-50 transition text-sm"
                  title="Delete"
                >
                  <Icon icon="mdi:trash-can" width="18" className="mr-1" /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} className="mt-4" />

      {/* Delete confirmation modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Confirm Delete" size="md">
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 font-medium">This action cannot be undone.</div>
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete user <strong>{userToDelete?.full_name}</strong>?
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setDeleteModalOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </Modal>
    </>
  );
};

export default UserTable;
