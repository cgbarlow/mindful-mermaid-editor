import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface GitHubConfigProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: { token: string; owner: string; repo: string }) => void;
}

export const GitHubConfig = ({ isOpen, onClose, onSave }: GitHubConfigProps) => {
  const [token, setToken] = useState("");
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");

  const handleSave = () => {
    if (!token || !owner || !repo) return;
    onSave({ token, owner, repo });
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>GitHub Configuration</SheetTitle>
          <SheetDescription>
            Configure your GitHub repository settings to save diagrams.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="token">GitHub Token</Label>
            <Input
              id="token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="owner">Repository Owner</Label>
            <Input
              id="owner"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="username or organization"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="repo">Repository Name</Label>
            <Input
              id="repo"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="my-diagrams"
            />
          </div>
          <Button onClick={handleSave} className="w-full mt-4">
            Save Configuration
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};