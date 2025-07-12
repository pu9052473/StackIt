"use client";

import React, { useCallback } from "react";
import { useEditor, EditorContent, JSONContent } from "@tiptap/react";
import { editorExtensions } from "@/lib/editor/extensions";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignCenter,
  AlignLeft,
  AlignRight,
  ImageIcon,
  List,
  ListOrdered,
} from "lucide-react";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadThing";

import { EmojiPicker } from "./EmojiPicker";
import { SidebarSeparator } from "../ui/sidebar";
// import "@/styles/editor.css"; // Optional custom styles

type Props = {
  content?: JSONContent | string;
  onChange?: (content: JSONContent) => void;
};

const TiptapEditor = ({ content, onChange }: Props) => {
  const editor = useEditor({
    extensions: editorExtensions,
    content,
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-sm sm:prose-base min-h-[200px] focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange?.(json);
    },
  });

  const insertImage = useCallback(
    (url: string) => {
      editor?.chain().focus().setImage({ src: url }).run();
    },
    [editor]
  );

  return (
    <div className="border rounded-xl p-4 bg-gray-900">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-3 items-center">
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className="p-1 hover:bg-gray-800 rounded"
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className="p-1 hover:bg-gray-800 rounded"
        >
          <Italic size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className="p-1 hover:bg-gray-800 rounded"
        >
          <Underline size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          className="p-1 hover:bg-gray-800 rounded"
        >
          <Strikethrough size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className="p-1 hover:bg-gray-800 rounded"
        >
          <List size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className="p-1 hover:bg-gray-800 rounded"
        >
          <ListOrdered size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().setTextAlign("left").run()}
          className="p-1 hover:bg-gray-800 rounded"
        >
          <AlignLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().setTextAlign("center").run()}
          className="p-1 hover:bg-gray-800 rounded"
        >
          <AlignCenter size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().setTextAlign("right").run()}
          className="p-1 hover:bg-gray-800 rounded"
        >
          <AlignRight size={18} />
        </button>

        <UploadButton<OurFileRouter, "editorImage">
          endpoint="editorImage"
          onClientUploadComplete={(res) => {
            if (res && res[0].url) insertImage(res[0].url);
          }}
          onUploadError={(err) => alert(`Upload error: ${err.message}`)}
          appearance={{
            button: "p-1 hover:bg-gray-800 rounded flex items-center",
          }}
          content={{
            button: <ImageIcon size={18} />,
          }}
        />
        <EmojiPicker
          onEmojiSelect={(emoji) => {
            editor?.chain().focus().insertContent(emoji.native).run();
          }}
        />
      </div>

      <EditorContent
        editor={editor}
        placeholder="Describe your problem in detail..."
      />
    </div>
  );
};

export default TiptapEditor;
