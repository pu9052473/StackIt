import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Emoji from "@tiptap/extension-emoji";

import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";

export const editorExtensions = [
  StarterKit,

  Underline,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Image,
  Emoji,
  BulletList,
  OrderedList,
  ListItem,
];
