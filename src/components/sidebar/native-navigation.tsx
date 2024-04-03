import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";
import { HomeIcon, SettingsIcon, TrashIcon } from "../icons";
import { Settings } from "..";

interface Props {
  workspaceId?: string;
  className?: string;
}

const NativeNavigation: React.FC<Props> = ({ workspaceId, className }) => {
  return (
    <div className={twMerge("my-2", className)}>
      <ul className="flex flex-col gap-2">
        <li>
          <Link
            className="
              group/native
              flex
              text-Neutrals/neutrals-7
              transition-all
              gap-2"
            href={`/dashboard/${workspaceId}`}
          >
            <HomeIcon />
            <span>My Workspace</span>
          </Link>
        </li>

        <Settings>
          <li
            className="
            group/native
            flex
            text-Neutrals/neutrals-7
            transition-all
            gap-2
            cursor-pointer"
          >
            <SettingsIcon />
            <span>Settings</span>
          </li>
        </Settings>

        <li>
          <Link
            className="
              group/native
              flex
              text-Neutrals/neutrals-7
              transition-all
              gap-2"
            href={`/dashboard/${workspaceId}`}
          >
            <TrashIcon />
            <span>Trash</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default NativeNavigation;
