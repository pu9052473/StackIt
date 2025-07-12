import { JSONContent } from "@tiptap/react";

import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
type Props = {
  content?: JSONContent | string;
  onChange?: (content: JSONContent) => void;
};

export const TiptapEditor = ({ content, onChange }: Props) => {
  return <SimpleEditor content={content} onChange={onChange} />;
}
