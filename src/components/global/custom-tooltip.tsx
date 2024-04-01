import React from "react";
import { Tooltip } from "..";

interface Props {
  children: React.ReactNode;
  message: string;
}

const CustomTooltip: React.FC<Props> = ({ children, message }) => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger>{children}</Tooltip.Trigger>
        <Tooltip.Content>{message}</Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default CustomTooltip;
