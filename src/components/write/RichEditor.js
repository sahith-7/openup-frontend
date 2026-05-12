// ============================================================
// OpenUp - Rich Text Editor (TipTap)
// ============================================================
"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { useEffect } from "react";

function Btn({ onClick, active, title, children }) {
  return (
    <button type="button" onMouseDown={e => { e.preventDefault(); onClick(); }} title={title}
      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${active?"text-white":""}`}
      style={active ? { background:"var(--color-brand)" } : { color:"var(--text-muted)" }}>
      {children}
    </button>
  );
}

export default function RichEditor({ value, onChange, placeholder, type = "story" }) {
  const placeholders = {
    story:"Begin your story here… let the words flow.",
    poem:"Let your verses take shape…",
    quote:"Write something that cuts to the truth…",
    thought:"What's on your mind today?",
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels:[1,2,3] } }),
      Underline,
      Placeholder.configure({ placeholder: placeholder || placeholders[type] || placeholders.story }),
      CharacterCount,
    ],
    content: value || "",
    editorProps: { attributes: { class:"ProseMirror focus:outline-none min-h-[280px]" } },
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && value !== undefined && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value]);

  if (!editor) return null;

  const words = editor.storage.characterCount?.words() ?? 0;

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b flex-wrap sticky top-16 z-10 rounded-t-xl"
        style={{ background:"var(--bg-card)", borderColor:"var(--border-light)" }}>
        <Btn onClick={() => editor.chain().focus().toggleHeading({level:1}).run()} active={editor.isActive("heading",{level:1})} title="H1">H1</Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({level:2}).run()} active={editor.isActive("heading",{level:2})} title="H2">H2</Btn>
        <span className="w-px h-5 mx-1" style={{ background:"var(--border-medium)" }}/>
        <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold"><strong>B</strong></Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic"><em>I</em></Btn>
        <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline"><u>U</u></Btn>
        <span className="w-px h-5 mx-1" style={{ background:"var(--border-medium)" }}/>
        <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Quote">❝</Btn>
        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="List">•≡</Btn>
        <span className="w-px h-5 mx-1" style={{ background:"var(--border-medium)" }}/>
        <Btn onClick={() => editor.chain().focus().undo().run()} active={false} title="Undo">↩</Btn>
        <Btn onClick={() => editor.chain().focus().redo().run()} active={false} title="Redo">↪</Btn>
        <span className="ml-auto text-xs" style={{ color:"var(--text-muted)" }}>{words} words</span>
      </div>

      {/* Editor */}
      <div className="p-5 sm:p-8 rounded-b-xl" style={{ background:"var(--bg-card)", border:"1px solid var(--border-light)", borderTop:"none", minHeight:"320px" }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
