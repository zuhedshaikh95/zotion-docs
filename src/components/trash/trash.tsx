import React from "react";
import CustomDialogTrigger from "../global/custom-dialogue-trigger";
import TrashRestore from "./trash-restore";

interface Props {
  children: React.ReactNode;
}

const Trash: React.FC<Props> = ({ children }) => {
  return (
    <CustomDialogTrigger header="Trash" content={<TrashRestore />}>
      {children}
    </CustomDialogTrigger>
  );
};

export default Trash;
