import React from "react";
import DefaultLayout from "@/layouts/DefaultLayout";
import ProfileForm from "./components/ProfileForm";
import KycDocumentsTable from "./components/KycDocumentsTable";
import WithdrawalMethodsTable from "./components/WithdrawalMethodsTable";
import ChangePasswordForm from "./components/ChangePassword";

const Profile = () => {
  return (
    <DefaultLayout>
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Left column: Profile form */}
        <div className="w-full lg:w-1/3">
          <ProfileForm />
        </div>

        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          <KycDocumentsTable />
          <WithdrawalMethodsTable />
          <ChangePasswordForm />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Profile;
