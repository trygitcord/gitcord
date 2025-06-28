"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Gift, AlertCircle } from "lucide-react";
import { useRedeemCode } from "@/hooks/useMyApiQueries";

function ReedemCode() {
  const [code, setCode] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const redeemCodeMutation = useRedeemCode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setErrorMessage("");

    try {
      const result = await redeemCodeMutation.mutateAsync(code);

      if (result.success) {
        setIsSuccess(true);
        setCode("");
        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "An error occurred";
      setErrorMessage(message);
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex items-center space-x-2 text-green-600">
        <CheckCircle2 className="w-4 h-4 animate-pulse" />
        <span className="text-sm font-medium">Code redeemed successfully!</span>
        <Gift className="w-4 h-4 text-yellow-500 animate-bounce" />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex items-center space-x-2 text-red-600">
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm font-medium">{errorMessage}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <Input
        type="text"
        placeholder="Enter code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-52 h-8 text-xs font-mono tracking-wider uppercase placeholder:text-start placeholder:text-xs"
        disabled={redeemCodeMutation.isPending}
      />

      <Button
        type="submit"
        size="sm"
        className="h-8 px-3 text-xs hover:cursor-pointer"
        disabled={!code.trim() || redeemCodeMutation.isPending}
      >
        {redeemCodeMutation.isPending ? (
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Checking...</span>
          </div>
        ) : (
          "Redeem"
        )}
      </Button>
    </form>
  );
}

export default ReedemCode;
