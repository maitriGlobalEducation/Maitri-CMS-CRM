"use client";

import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Undo2,
  Redo2,
} from "lucide-react";
import { useEffect } from "react";

interface BlogEditorProps {
  content?: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
}

export default function BlogEditor({ content, onChange }: BlogEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],

    content: content ?? {
      type: "doc",
      content: [{ type: "paragraph" }],
    },

    immediatelyRender: false,

    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },

    editorProps: {
      attributes: {
        class:
          "blog-editor ProseMirror min-h-80 px-5 py-4 text-sm leading-7 text-zinc-800 outline-none",
      },
    },
  });

  useEffect(() => {
    if (!editor || !content) return;

    const currentContent = editor.getJSON();

    if (JSON.stringify(currentContent) !== JSON.stringify(content)) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  const editorState = useEditorState({
    editor,

    selector: ({ editor }) => ({
      isBold: editor?.isActive("bold") ?? false,
      isItalic: editor?.isActive("italic") ?? false,

      isH2:
        editor?.isActive("heading", {
          level: 2,
        }) ?? false,

      isH3:
        editor?.isActive("heading", {
          level: 3,
        }) ?? false,

      isBulletList: editor?.isActive("bulletList") ?? false,

      isOrderedList: editor?.isActive("orderedList") ?? false,

      isBlockquote: editor?.isActive("blockquote") ?? false,

      canUndo: editor?.can().chain().focus().undo().run() ?? false,

      canRedo: editor?.can().chain().focus().redo().run() ?? false,
    }),
  });

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b border-zinc-200 bg-zinc-50 p-2">
        <ToolbarButton
          active={editorState?.isH2}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          title="Heading 2"
        >
          <Heading2 size={17} />
        </ToolbarButton>

        <ToolbarButton
          active={editorState?.isH3}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          title="Heading 3"
        >
          <Heading3 size={17} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          active={editorState?.isBold}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          <Bold size={17} />
        </ToolbarButton>

        <ToolbarButton
          active={editorState?.isItalic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          <Italic size={17} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          active={editorState?.isBulletList}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet list"
        >
          <List size={17} />
        </ToolbarButton>

        <ToolbarButton
          active={editorState?.isOrderedList}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered list"
        >
          <ListOrdered size={17} />
        </ToolbarButton>

        <ToolbarButton
          active={editorState?.isBlockquote}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Quote"
        >
          <Quote size={17} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          disabled={!editorState?.canUndo}
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <Undo2 size={17} />
        </ToolbarButton>

        <ToolbarButton
          disabled={!editorState?.canRedo}
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <Redo2 size={17} />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  active = false,
  disabled = false,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-md cursor-pointer transition ${
        active
          ? "bg-zinc-900 text-white"
          : "text-zinc-600 hover:bg-zinc-200 hover:text-zinc-950"
      } disabled:cursor-not-allowed disabled:opacity-30`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="mx-1 h-5 w-px bg-zinc-300" />;
}
