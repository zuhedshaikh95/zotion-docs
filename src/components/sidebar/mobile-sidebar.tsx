"use client";
import { Menu } from "lucide-react";
import React, { useState } from "react";
import { PageIcon } from "../icons";
import clsx from "clsx";

interface Props {
  children: React.ReactNode;
}

const nativeNavigations = [
  {
    title: "Sidebar",
    id: "sidebar",
    icon: Menu,
  },
  {
    title: "Pages",
    id: "pages",
    icon: PageIcon,
  },
] as const;

const MobileSidebar: React.FC<Props> = ({ children }) => {
  const [selectedNav, setSelectedNav] = useState<string>("");

  return (
    <>
      {selectedNav === "sidebar" && <>{children}</>}
      <nav
        className="
            bg-black/10
            backdrop-blur-lg
            sm:hidden
            fixed
            z-50
            inset-0
            top-auto"
      >
        <ul
          className="
            flex
            justify-between
            items-center
            p-4"
        >
          {nativeNavigations.map((navItem) => (
            <li
              key={navItem.id}
              className="
                flex
                items-center
                flex-col
                justify-center"
              onClick={() => setSelectedNav(navItem.id)}
            >
              {<navItem.icon />}
              <small
                className={clsx("", {
                  "text-muted-foreground": selectedNav !== navItem.id,
                })}
              >
                {navItem.title}
              </small>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default MobileSidebar;
