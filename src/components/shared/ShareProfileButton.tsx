import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface ShareProfileButtonProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  username?: string;
}

export const ShareProfileButton: React.FC<ShareProfileButtonProps> = ({
  className = "",
  variant = "ghost",
  size = "sm",
  username,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const getProfileUrl = () => {
    if (username) {
      return `${window.location.origin}/user/${username}`;
    }
    // Fallback to current URL if no username provided
    return window.location.href;
  };

  const handleCopy = async () => {
    const profileUrl = getProfileUrl();
    try {
      await navigator.clipboard.writeText(profileUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Copy error:", err);
    }
  };

  return (
    <Button
      onClick={handleCopy}
      variant={variant}
      size={size}
      className={`p-3 text-neutral-200 hover:bg-neutral-800 hover:text-neutral-100 hover:cursor-pointer ${className}`}
      title="Copy profile link"
    >
      {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
    </Button>
  );
};
