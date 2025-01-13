import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Editor } from "@/components/Editor";
import { Preview } from "@/components/Preview";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { saveToGitHub } from "@/lib/github";

const defaultDiagram = `graph TD
    A[Start] --> B{Is it?}
    B -- Yes --> C[OK]
    C --> D[Rethink]
    D --> B
    B -- No --> E[End]`;

const Index = () => {
  const [code, setCode] = useState(defaultDiagram);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      await saveToGitHub(code);
      toast.success("Diagram saved successfully!");
    } catch (err) {
      toast.error("Failed to save diagram");
      console.error(err);
    }
  };

  return (
    <div className="h-screen w-full bg-background">
      <div className="container mx-auto p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Mermaid Diagram Editor</h1>
          <Button onClick={handleSave}>Save to GitHub</Button>
        </div>
        <div className="flex-1">
          <ResizablePanelGroup direction="horizontal" className="min-h-[200px] rounded-lg border">
            <ResizablePanel defaultSize={50}>
              <Editor code={code} onChange={setCode} onError={setError} />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
              <Preview code={code} error={error} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
};

export default Index;