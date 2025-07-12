"use client";

import { useState } from "react";
import { Smile } from "lucide-react";
import dynamic from "next/dynamic";
import data from "@emoji-mart/data";

// Dynamically import Picker to avoid SSR issues
const Picker = dynamic(
  () => import("@emoji-mart/react").then(mod => mod.default),
  { ssr: false }
);

export const EmojiPicker = ({ onEmojiSelect }: { onEmojiSelect: (emoji: any) => void }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button type="button" onClick={() => setOpen(prev => !prev)}>
        <Smile size={18} />
      </button>
      {open && (
        <div className="absolute z-50 mt-2">
          <Picker
            data={data}
            onEmojiSelect={(e: any) => {
              onEmojiSelect(e);
              setOpen(false);
            }}
            theme="light"
          />
        </div>
      )}
    </div>
  );
};
