import { editorExtensions } from "@/lib/editor/extensions";
import { EditorContent, useEditor } from "@tiptap/react";

export function ReadOnlyViewer({ content }: { content: any }) {
  const editor = useEditor({
    extensions: editorExtensions,
    editable: false,
    content,
  });

  return <EditorContent editor={editor} />;
}
