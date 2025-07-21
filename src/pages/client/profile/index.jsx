import React from "react";
import DefaultLayout from "@/layouts/DefaultLayout";
import ProfileForm from "./components/ProfileForm";
import KycDocumentsTable from "./components/KycDocumentsTable";
import WithdrawalMethodsTable from "./components/WithdrawalMethodsTable";
import ChangePasswordForm from "./components/ChangePassword";

const Profile = () => {
  return (
    <DefaultLayout>
      <div className="py-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          <div className="col-span-1">
            <ProfileForm />
          </div>
          <div className="col-span-1 lg:col-span-2 space-y-6">
            <KycDocumentsTable />
            <WithdrawalMethodsTable />
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Profile;
