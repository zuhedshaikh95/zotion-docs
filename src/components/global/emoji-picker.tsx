"use client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { Popover } from "..";
import { EmojiClickData } from "emoji-picker-react";

interface Props {
  children: React.ReactNode;
  onEmojiClick?: (emoji: EmojiClickData) => void;
}

const EmojiPicker: React.FC<Props> = ({ children, onEmojiClick }) => {
  const router = useRouter();

  const Picker = useMemo(() => dynamic(() => import("emoji-picker-react")), []);

  const onClick = (selectedEmoji: EmojiClickData) => {
    if (onEmojiClick) onEmojiClick(selectedEmoji);
  };

  return (
    <div
      className="
        flex
        items-center"
    >
      <Popover.Root>
        <Popover.Trigger className="cursor-pointer">{children}</Popover.Trigger>
        <Popover.Content
          className="
            p-0
            border-none"
        >
          <Picker onEmojiClick={onClick} />
        </Popover.Content>
      </Popover.Root>
    </div>
  );
};

export default EmojiPicker;
