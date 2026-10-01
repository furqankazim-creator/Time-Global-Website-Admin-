import { useState, useRef } from "react";
import {
  Bold, Italic, Strikethrough, Heading2, Heading3,
  List, ListOrdered, Quote, Code, Link2, Eye, Edit3, Code2,
  Smartphone, Monitor, Sparkles
} from "lucide-react";

type Props = {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  rows?: number;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
};

export function RichTextEditor({
  value,
  onChange,
  label,
  rows = 12,
  placeholder = "Write content here...",
  error,
  disabled,
}: Props) {
  const [tab, setTab] = useState<"edit" | "preview" | "raw">("edit");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyTag = (openTag: string, closeTag: string, defaultText = "text") => {
    const ta = textareaRef.current;
    if (!ta) return;

    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = ta.value.substring(start, end) || defaultText;
    const replacement = `${openTag}${selected}${closeTag}`;

    const nextVal = ta.value.substring(0, start) + replacement + ta.value.substring(end);
    onChange(nextVal);

    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + openTag.length, start + openTag.length + selected.length);
    }, 10);
  };

  const insertLink = () => {
    const url = window.prompt("Enter link URL:", "https://");
    if (!url) return;
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = ta.value.substring(start, end) || "link text";
    const replacement = `<a href="${url}" target="_blank" rel="noopener noreferrer">${selected}</a>`;
    const nextVal = ta.value.substring(0, start) + replacement + ta.value.substring(end);
    onChange(nextVal);
  };

  const wordCount = value.trim() ? value.replace(/<[^>]*>/g, "").trim().split(/\s+/).length : 0;
  const charCount = value.length;
  const readTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        {label && <label className="block text-sm font-medium">{label}</label>}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-auto">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{charCount} chars</span>
          <span>•</span>
          <span>~{readTimeMin} min read</span>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden focus-within:border-primary transition-colors">
        {/* Header Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-1 p-2 bg-muted/40 border-b border-border">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setTab("edit")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                tab === "edit"
                  ? "bg-background text-foreground shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Edit3 size={13} /> Visual Editor
            </button>
            <button
              type="button"
              onClick={() => setTab("preview")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                tab === "preview"
                  ? "bg-background text-foreground shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Eye size={13} /> Live Preview
            </button>
            <button
              type="button"
              onClick={() => setTab("raw")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                tab === "raw"
                  ? "bg-background text-foreground shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Code2 size={13} /> HTML Source
            </button>
          </div>

          {tab === "preview" && (
            <div className="flex items-center gap-1 bg-background border border-border rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setPreviewDevice("desktop")}
                className={`p-1 rounded ${previewDevice === "desktop" ? "bg-muted text-foreground" : "text-muted-foreground"}`}
                title="Desktop View"
              >
                <Monitor size={14} />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice("mobile")}
                className={`p-1 rounded ${previewDevice === "mobile" ? "bg-muted text-foreground" : "text-muted-foreground"}`}
                title="Mobile View"
              >
                <Smartphone size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Action buttons (only in edit/raw mode) */}
        {tab !== "preview" && (
          <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b border-border/60 bg-muted/10 text-muted-foreground">
            <button
              type="button"
              title="Heading 2"
              onClick={() => applyTag("<h2>", "</h2>", "Section Title")}
              className="p-1.5 hover:bg-muted hover:text-foreground rounded"
            >
              <Heading2 size={15} />
            </button>
            <button
              type="button"
              title="Heading 3"
              onClick={() => applyTag("<h3>", "</h3>", "Sub-heading")}
              className="p-1.5 hover:bg-muted hover:text-foreground rounded"
            >
              <Heading3 size={15} />
            </button>
            <div className="w-px h-4 bg-border mx-1" />
            <button
              type="button"
              title="Bold"
              onClick={() => applyTag("<strong>", "</strong>")}
              className="p-1.5 hover:bg-muted hover:text-foreground rounded"
            >
              <Bold size={15} />
            </button>
            <button
              type="button"
              title="Italic"
              onClick={() => applyTag("<em>", "</em>")}
              className="p-1.5 hover:bg-muted hover:text-foreground rounded"
            >
              <Italic size={15} />
            </button>
            <button
              type="button"
              title="Strikethrough"
              onClick={() => applyTag("<s>", "</s>")}
              className="p-1.5 hover:bg-muted hover:text-foreground rounded"
            >
              <Strikethrough size={15} />
            </button>
            <div className="w-px h-4 bg-border mx-1" />
            <button
              type="button"
              title="Bullet list"
              onClick={() => applyTag("<ul>\n  <li>", "</li>\n</ul>", "List item")}
              className="p-1.5 hover:bg-muted hover:text-foreground rounded"
            >
              <List size={15} />
            </button>
            <button
              type="button"
              title="Numbered list"
              onClick={() => applyTag("<ol>\n  <li>", "</li>\n</ol>", "First step")}
              className="p-1.5 hover:bg-muted hover:text-foreground rounded"
            >
              <ListOrdered size={15} />
            </button>
            <button
              type="button"
              title="Quote block"
              onClick={() => applyTag("<blockquote>", "</blockquote>", "Quotation")}
              className="p-1.5 hover:bg-muted hover:text-foreground rounded"
            >
              <Quote size={15} />
            </button>
            <button
              type="button"
              title="Code block"
              onClick={() => applyTag("<pre><code>", "</code></pre>", "// your code here")}
              className="p-1.5 hover:bg-muted hover:text-foreground rounded"
            >
              <Code size={15} />
            </button>
            <button
              type="button"
              title="Link"
              onClick={insertLink}
              className="p-1.5 hover:bg-muted hover:text-foreground rounded"
            >
              <Link2 size={15} />
            </button>
          </div>
        )}

        {/* Content Area */}
        {tab === "preview" ? (
          <div className="p-4 bg-background/50 flex justify-center min-h-[280px]">
            <div
              className={`w-full bg-card rounded-lg border border-border/80 p-6 overflow-y-auto prose dark:prose-invert max-w-none ${
                previewDevice === "mobile" ? "max-w-sm shadow-lg my-2" : ""
              }`}
            >
              {value ? (
                <div dangerouslySetInnerHTML={{ __html: value }} />
              ) : (
                <p className="text-muted-foreground italic text-sm">Nothing to preview yet. Start typing in the editor.</p>
              )}
            </div>
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            rows={rows}
            value={value}
            disabled={disabled}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-4 bg-transparent text-sm font-sans focus:outline-none resize-y leading-relaxed font-normal"
          />
        )}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
