"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  X,
  Mail,
  Filter,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import {
  useGetUserMessages,
  useMarkAsRead,
  useDeleteMessage,
} from "@/hooks/useMessageQueries";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    username: string;
    avatar_url: string;
  };
  subject: string;
  content: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<string>("all");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const {
    data: messagesData,
    isLoading,
    error,
  } = useGetUserMessages(
    currentPage,
    10,
    filter === "all" ? undefined : filter
  );

  const markAsReadMutation = useMarkAsRead();
  const deleteMessageMutation = useDeleteMessage();

  const handleMarkAsRead = (messageId: string) => {
    markAsReadMutation.mutate(messageId);
  };

  const handleDeleteMessage = (messageId: string) => {
    deleteMessageMutation.mutate(messageId);
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(null);
    }
  };

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      handleMarkAsRead(message.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (error) {
    return (
      <div className="w-full">
        <div className="mb-4">
          <h1 className="text-lg font-medium flex items-center gap-2">Inbox</h1>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 text-center">
          <p className="text-red-600 dark:text-red-400">
            An error occurred while loading messages.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-medium flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Inbox
              {messagesData?.data.unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {messagesData.data.unreadCount}
                </span>
              )}
            </h1>
            <p className="text-neutral-500 text-sm dark:text-neutral-400">
              Manage your messages and notifications in one place.
            </p>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="read">Read</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 flex gap-4">
        {/* Messages List - 20% */}
        <div className="w-1/5 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="font-medium text-sm text-neutral-600 dark:text-neutral-400">
              MESSAGES ({messagesData?.data.pagination.totalCount || 0})
            </h2>
          </div>

          <div className="overflow-auto h-full">
            {isLoading ? (
              <div className="p-4 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : messagesData?.data.messages.length === 0 ? (
              <div className="p-4 text-center flex items-center justify-center h-full gap-4">
                <Mail className="w-8 h-8 text-neutral-400" />
                <p className="text-neutral-500 dark:text-neutral-400 text-xs">
                  {filter === "unread"
                    ? "No unread messages."
                    : filter === "read"
                    ? "No read messages."
                    : "No messages yet."}
                </p>
              </div>
            ) : (
              messagesData?.data.messages.map((message: Message) => (
                <div
                  key={message.id}
                  onClick={() => handleMessageClick(message)}
                  className={`p-3 border-b border-neutral-100 dark:border-neutral-800 cursor-pointer transition-colors relative group ${
                    !message.isRead
                      ? "bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50"
                      : "hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  } ${
                    selectedMessage?.id === message.id
                      ? "bg-neutral-100 dark:bg-neutral-800"
                      : ""
                  }`}
                >
                  {/* Delete button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-1 right-1 w-5 h-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMessage(message.id);
                    }}
                  >
                    <X className="w-3 h-3" />
                  </Button>

                  <div className="flex items-start gap-2 pr-6">
                    {/* Gitcord Logo */}
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/logo.svg" />
                      <AvatarFallback className="bg-[#5BC898] text-white font-bold text-xs">
                        G
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="font-medium text-xs truncate">
                          Gitcord
                        </span>
                        <ShieldCheck className="w-3 h-3 text-[#5BC898] fill-current flex-shrink-0" />
                        {!message.isRead && (
                          <div className="w-2 h-2 bg-[#5BC898] rounded-full flex-shrink-0" />
                        )}
                      </div>

                      <h3
                        className={`text-xs truncate mb-1 ${
                          !message.isRead ? "font-medium" : "font-normal"
                        }`}
                      >
                        {message.subject}
                      </h3>

                      <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                        {new Date(message.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {messagesData?.data.pagination &&
            messagesData.data.pagination.totalPages > 1 && (
              <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={!messagesData.data.pagination.hasPrev}
                  className="text-xs px-2 py-1 h-7"
                >
                  <ChevronLeft className="w-3 h-3" />
                </Button>

                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {messagesData.data.pagination.currentPage}/
                  {messagesData.data.pagination.totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={!messagesData.data.pagination.hasNext}
                  className="text-xs px-2 py-1 h-7"
                >
                  <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
            )}
        </div>

        {/* Message Detail - 80% */}
        <div className="w-4/5 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
          {selectedMessage ? (
            <div className="h-full flex flex-col">
              {/* Message Header */}
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="/logo.svg" />
                    <AvatarFallback className="bg-[#5BC898] text-white font-bold text-lg">
                      G
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-medium text-lg">Gitcord</h2>
                      {/* Glowing Official Message Badge */}
                      <span
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#5BC898] text-white shadow-md"
                        style={{ boxShadow: "0 0 3px 1.5px #5BC89844" }}
                      >
                        Official Message
                      </span>
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      @gitcord
                    </p>
                    <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">
                      {formatDate(selectedMessage.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="flex-1 p-6 overflow-auto">
                {/* Subject */}
                <div className="mb-6">
                  <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    {selectedMessage.subject}
                  </h1>
                  <div className="h-px bg-neutral-200 dark:bg-neutral-700"></div>
                </div>

                {/* Content */}
                <div className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  <p className="whitespace-pre-wrap">
                    {selectedMessage.content}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Mail className="w-20 h-20 text-neutral-300 dark:text-neutral-600 mx-auto mb-6" />
                <h3 className="text-2xl font-medium text-neutral-600 dark:text-neutral-400 mb-3">
                  Select a Message
                </h3>
                <p className="text-neutral-500 dark:text-neutral-500 max-w-md mx-auto">
                  Choose a message from the left sidebar to view its details and
                  content.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
