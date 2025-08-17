"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { useSubmitFeedback } from "@/hooks/useFeedbackQueries";
import { useUserProfile } from "@/hooks/useMyApiQueries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const { data: session } = useSession();
  const { data: profile } = useUserProfile();
  const [message, setMessage] = useState("");
  const [consentGiven, setConsentGiven] = useState<CheckedState>(true);
  const submitFeedback = useSubmitFeedback();

  // Reset message when modal closes
  useEffect(() => {
    if (!isOpen) {
      setMessage("");
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();

    if (!trimmedMessage || !session?.user) return;

    if (trimmedMessage.length < 10) {
      return;
    }

    if (trimmedMessage.length > 1000) {
      return;
    }

    try {
      await submitFeedback.mutateAsync({
        message: trimmedMessage,
        consentGiven: consentGiven === true,
      });
      setMessage("");
      onClose();
    } catch (error) {
      // Error is handled by the hook
      console.error("Failed to submit feedback:", error);
    }
  };

  const messageLength = message.trim().length;
  const isMessageValid = messageLength >= 10 && messageLength <= 1000;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-w-[90vw] w-full">
        <DialogHeader>
          <DialogTitle>Give us feedback</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 w-full overflow-hidden">
          <div className="space-y-3">
            <Label
              htmlFor="username"
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Github User
            </Label>
            <div className="mt-2 flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-md">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="text-xs">
                  {profile?.username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-normal text-sm text-neutral-900 dark:text-neutral-100">
                  {profile?.name || "No name"}
                </span>
                <span className="text-xs text-neutral-500">
                  @{profile?.username}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 w-full min-w-0">
            <div className="flex items-center justify-between w-full">
              <Label
                htmlFor="message"
                className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex-shrink-0"
              >
                Message
              </Label>
              <span
                className={`text-xs flex-shrink-0 ml-2 ${
                  messageLength < 10
                    ? "text-neutral-400"
                    : messageLength > 1000
                    ? "text-neutral-400"
                    : "text-neutral-500"
                }`}
              >
                {messageLength}/1000
              </span>
            </div>
            <div className="w-full">
              <Textarea
                id="message"
                placeholder="Share your thoughts, suggestions, or report issues... (minimum 10 characters)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={8}
                className={`resize-none min-h-32 w-full max-w-full break-words whitespace-pre-wrap ${
                  messageLength > 0 && !isMessageValid
                    ? "border-neutral-300 focus:border-neutral-400 focus:ring-neutral-400"
                    : ""
                }`}
                required
                maxLength={1000}
                style={{ 
                  wordWrap: 'break-word', 
                  overflowWrap: 'break-word',
                  width: '100%',
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                  overflow: 'hidden'
                }}
              />
            </div>
            {messageLength > 0 && messageLength < 10 && (
              <p className="text-xs text-neutral-500">
                Message must be at least 10 characters long
              </p>
            )}
            {messageLength > 1000 && (
              <p className="text-xs text-neutral-500">
                Message cannot exceed 1000 characters
              </p>
            )}
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="consent"
              checked={consentGiven}
              onCheckedChange={setConsentGiven}
              disabled
              className="mt-0.5"
            />
            <Label
              htmlFor="consent"
              className="text-sm font-normal text-neutral-600 dark:text-neutral-400 leading-relaxed"
            >
              I consent to sharing this feedback and my profile with the Gitcord
              team for platform improvements and potential testimonials.
            </Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isMessageValid || submitFeedback.isPending}
              className="bg-[#5BC898] hover:bg-[#4BAA7F] text-white disabled:opacity-50"
            >
              {submitFeedback.isPending ? "Submitting..." : "Submit Feedback"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
