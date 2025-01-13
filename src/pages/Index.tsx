import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Editor } from "@/components/Editor";
import { Preview } from "@/components/Preview";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { saveToGitHub } from "@/lib/github";
import { GitHubConfig } from "@/components/GitHubConfig";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const defaultDiagram = `graph TD
    A[Start] --> B{Is it?}
    B -- Yes --> C[OK]
    C --> D[Rethink]
    D --> B
    B -- No --> E[End]`;

const Index = () => {
  const [code, setCode] = useState(defaultDiagram);
  const [error, setError] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [diagramTitle, setDiagramTitle] = useState("Untitled Diagram");
  const [showLoadDialog, setShowLoadDialog] = useState(false);

  const handleSave = async () => {
    const token = localStorage.getItem("github_token");
    const owner = localStorage.getItem("github_owner");
    const repo = localStorage.getItem("github_repo");

    if (!token || !owner || !repo) {
      setShowConfig(true);
      return;
    }

    try {
      await saveToGitHub(code);
      toast.success("Diagram saved successfully!");
    } catch (err: any) {
      const errorMessage = debugMode 
        ? `Error details: ${JSON.stringify(err, null, 2)}`
        : "Failed to save diagram";
      
      console.error("Failed to save to GitHub:", err);
      toast.error(errorMessage, {
        duration: debugMode ? 10000 : 3000,
      });
    }
  };

  const handleConfigSave = (config: { token: string; owner: string; repo: string }) => {
    localStorage.setItem("github_token", config.token);
    localStorage.setItem("github_owner", config.owner);
    localStorage.setItem("github_repo", config.repo);
    toast.success("GitHub configuration saved!");
    setShowConfig(false);
    handleSave();
  };

  const handleFileLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCode(content);
        setDiagramTitle(file.name.replace('.mmd', ''));
      };
      reader.readAsText(file);
    }
  };

  const getFavorites = () => {
    const owner = localStorage.getItem("github_owner");
    const repo = localStorage.getItem("github_repo");
    return owner && repo ? [`${owner}/${repo}`] : [];
  };

  return (
    <div className="h-screen w-full bg-background">
      <div className="container mx-auto p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Mindful Mermaid Editor</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="debug-mode"
                checked={debugMode}
                onCheckedChange={setDebugMode}
              />
              <Label htmlFor="debug-mode">Debug Mode</Label>
            </div>
            <Dialog open={showLoadDialog} onOpenChange={setShowLoadDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">Load</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Load Diagram</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="local">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="local">Local File</TabsTrigger>
                    <TabsTrigger value="github">GitHub</TabsTrigger>
                  </TabsList>
                  <TabsContent value="local" className="space-y-4">
                    <Input
                      type="file"
                      accept=".mmd,.txt"
                      onChange={handleFileLoad}
                    />
                  </TabsContent>
                  <TabsContent value="github" className="space-y-4">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Favorites</h4>
                      <div className="space-y-2">
                        {getFavorites().map((favorite) => (
                          <Button
                            key={favorite}
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => {
                              // TODO: Implement GitHub file loading
                              toast.info("GitHub loading will be implemented soon");
                            }}
                          >
                            {favorite}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
            <Button onClick={handleSave}>Save to GitHub</Button>
          </div>
        </div>
        <div className="flex-1">
          <ResizablePanelGroup direction="horizontal" className="min-h-[200px] rounded-lg border">
            <ResizablePanel defaultSize={50}>
              <div className="flex flex-col h-full">
                <div className="p-4 bg-slate-800">
                  <Input
                    value={diagramTitle}
                    onChange={(e) => setDiagramTitle(e.target.value)}
                    className="bg-slate-700 text-white border-slate-600"
                    placeholder="Diagram Title"
                  />
                </div>
                <Editor code={code} onChange={setCode} onError={setError} />
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
              <Preview code={code} error={error} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
        <GitHubConfig
          isOpen={showConfig}
          onClose={() => setShowConfig(false)}
          onSave={handleConfigSave}
        />
      </div>
    </div>
  );
};

export default Index;