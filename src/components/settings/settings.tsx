import React from "react";
import { CustomDialogTrigger, SettingsForm } from "..";

interface Props {
  children: React.ReactNode;
}

const Settings: React.FC<Props> = ({ children }) => {
  return (
    <CustomDialogTrigger header="Settings" content={<SettingsForm />}>
      {children}
    </CustomDialogTrigger>
  );
};

export default Settings;
