import CodeEditor from "@uiw/react-textarea-code-editor";

interface EditorProps {
  code: string;
  onChange: (code: string) => void;
  onError: (error: string | null) => void;
}

export const Editor = ({ code, onChange, onError }: EditorProps) => {
  return (
    <div className="flex-1 bg-slate-900">
      <CodeEditor
        value={code}
        language="mermaid"
        placeholder="Enter mermaid diagram code here..."
        onChange={(evn) => {
          onChange(evn.target.value);
          onError(null);
        }}
        style={{
          fontSize: 14,
          backgroundColor: "transparent",
          fontFamily: "JetBrains Mono, monospace",
          minHeight: "100%",
        }}
        className="min-h-full text-white p-4"
      />
    </div>
  );
};