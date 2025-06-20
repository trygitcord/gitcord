"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";

function SearchUserInput() {
  const [value, setValue] = useState("");
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim()) {
      router.push(`/user/${value.trim()}`);
    }
  };

  const handleSearch = () => {
    if (value.trim()) {
      router.push(`/user/${value.trim()}`);
    }
  };

  return (
    <div className="w-full relative">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
        <Input
          placeholder="Search GitHub username..."
          className="w-full pl-12 pr-12 h-12 text-base bg-background/50 backdrop-blur-sm border-2 border-border/50 rounded-xl focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {value.trim() && (
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 hover:cursor-pointer transform -translate-y-1/2 h-8 w-8 bg-primary hover:bg-primary/80 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <ArrowRight className="h-4 w-4 text-primary-foreground" />
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchUserInput;
