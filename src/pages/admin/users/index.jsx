import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/DefaultLayout";
import UserTable from "./components/UserTable";
import UserFormModal from "./components/UserFormModal";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import useWidth from "@/hooks/useWidth";

const ManageUsers = () => {
  const navigate = useNavigate();
  const { width, breakpoints } = useWidth();
  const isMobile = width < breakpoints.md;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (page) => {
    setLoading(true);
    try {
      const res = await API.private.getAllUsers({ page });
      if (res.status === 200 && res.data.code === "OK") {
        setUsers(res.data.data.users || []);
        setTotalPages(res.data.data.totalPages);
      }
    } catch (error) {
      const msg = error.response?.data?.error || "Failed to fetch users.";
      Notification.error(msg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedUser(null);
    setIsEdit(false);
    setIsFormOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEdit(true);
    setIsFormOpen(true);
  };

  const handleView = (user) => {
    navigate(`/admin/users/${user.id}`);
  };

  const handleDelete = async (user) => {
    try {
      const res = await API.private.deleteUser(user.id);
      if (res.status === 200 && res.data.code === "OK") {
        Notification.success(res.data.data.message || "User deleted successfully.");
        fetchUsers(currentPage);
      }
    } catch (error) {
      const msg = error.response?.data?.error || "Failed to delete user.";
      Notification.error(msg);
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (isEdit && selectedUser) {
        const res = await API.private.updateUser(selectedUser.id, data);
        if (res.status === 200 && res.data.code === "OK") {
          Notification.success(res.data.data.message || "User updated successfully.");
          fetchUsers(currentPage);
        }
      } else {
        const res = await API.private.createUser(data);
        if (res.status === 201 && res.data.code === "OK") {
          Notification.success(res.data.data.message || "User created successfully.");
          fetchUsers(1);
          setCurrentPage(1);
        }
      }
      setIsFormOpen(false);
    } catch (error) {
      const msg = error.response?.data?.error || "Failed to save user.";
      Notification.error(msg);
    }
  };

  return (
    <DefaultLayout>
      <div className="py-5">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200">Manage Users</h1>
          <button
            onClick={handleAdd}
            className="bg-accent text-white px-4 py-2 rounded font-medium hover:bg-accent/90 transition"
          >
            {isMobile ? "+" : "Add New User"}
          </button>
        </div>

        {loading ? (
          <>
            <Spinner />
            <p className="text-center text-gray-500 mt-4">Loading users...</p>
          </>
        ) : (
          <UserTable
            users={users}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        <Modal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          title={isEdit ? "Edit User" : "Add New User"}
          size="md"
        >
          <UserFormModal
            onSubmit={handleSubmit}
            onClose={() => setIsFormOpen(false)}
            initialData={selectedUser}
            isEdit={isEdit}
          />
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default ManageUsers;
