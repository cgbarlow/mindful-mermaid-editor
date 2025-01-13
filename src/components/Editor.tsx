import CodeEditor from "@uiw/react-textarea-code-editor";

interface EditorProps {
  code: string;
  onChange: (code: string) => void;
  onError: (error: string | null) => void;
}

export const Editor = ({ code, onChange, onError }: EditorProps) => {
  return (
    <div className="h-full bg-slate-900 p-4">
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
        className="min-h-full text-white"
      />
    </div>
  );
};