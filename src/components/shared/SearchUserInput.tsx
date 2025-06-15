"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

function SearchUserInput() {
  const [value, setValue] = useState("");
  const router = useRouter();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim()) {
      router.push(`/user/${value.trim()}`);
    }
  };

  return (
    <div className="w-full">
      <Input
        placeholder="Search for a user"
        className="w-full"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

export default SearchUserInput;
