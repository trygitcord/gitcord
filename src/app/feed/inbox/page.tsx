"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Bell,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  SlidersHorizontal,
  Clock,
} from "lucide-react";
import {
  useGetUserMessages,
  useMarkAsRead,
  useDeleteMessage,
} from "@/hooks/useMessageQueries";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Notification {
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
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    document.title = "Feed | Notifications";
  }, []);

  const {
    data: notificationsData,
    isLoading,
    error,
  } = useGetUserMessages(
    currentPage,
    10,
    filter === "all" ? undefined : filter
  );

  const markAsReadMutation = useMarkAsRead();
  const deleteNotificationMutation = useDeleteMessage();

  const handleMarkAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  const handleDeleteNotification = (notificationId: string) => {
    deleteNotificationMutation.mutate(notificationId);
    if (selectedNotification?.id === notificationId) {
      setIsModalOpen(false);
      setSelectedNotification(null);
    }
  };

  const openNotificationModal = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
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
          <h1 className="text-lg font-medium flex items-center gap-2">
            Notifications
          </h1>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 text-center">
          <p className="text-red-600 dark:text-red-400">
            An error occurred while loading notifications.
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
              Notifications
            </h1>
            <p className="text-neutral-500 text-sm dark:text-neutral-400">
              Stay updated with your latest activities and updates.
            </p>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-32">
              <SlidersHorizontal />
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

      <div className="flex-1 space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6"
              >
                <div className="flex items-start gap-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : notificationsData?.data.messages.length === 0 ? (
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-12 text-center">
            <Bell className="w-16 h-16 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-600 dark:text-neutral-400 mb-2">
              No Notifications
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">
              {filter === "unread"
                ? "No unread notifications."
                : filter === "read"
                ? "No read notifications."
                : "No notifications yet."}
            </p>
          </div>
        ) : (
          notificationsData?.data.messages.map((notification: Notification) => (
            <div
              key={notification.id}
              className={`bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 transition-all hover:shadow-sm relative group cursor-pointer ${
                !notification.isRead ? "border-l-4 border-l-[#5BC898]" : ""
              }`}
              onClick={() => openNotificationModal(notification)}
            >
              <div className="p-4">
                <div className="flex items-center gap-3">
                  {/* Notification Icon */}
                  <div className="w-8 h-8 bg-[#5BC898] rounded-full flex items-center justify-center flex-shrink-0">
                    <Bell className="w-4 h-4 text-white" />
                  </div>

                  {/* Content Preview */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
                        Gitcord
                      </span>
                      <ShieldCheck className="w-3 h-3 text-[#5BC898] fill-current flex-shrink-0" />
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-[#5BC898] rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <h3
                      className={`text-sm truncate text-neutral-700 dark:text-neutral-300 ${
                        !notification.isRead ? "font-medium" : ""
                      }`}
                    >
                      {notification.subject}
                    </h3>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-neutral-400 dark:text-neutral-500">
                      {new Date(notification.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>

                  {/* Dismiss button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="hover:cursor-pointer w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNotification(notification.id);
                    }}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Pagination */}
        {notificationsData?.data.pagination &&
          notificationsData.data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={!notificationsData.data.pagination.hasPrev}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                Page {notificationsData.data.pagination.currentPage} of{" "}
                {notificationsData.data.pagination.totalPages}
              </span>

              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={!notificationsData.data.pagination.hasNext}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
      </div>

      {/* Notification Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl">
          {selectedNotification && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#5BC898] rounded-full flex items-center justify-center flex-shrink-0">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <DialogTitle className="text-lg font-semibold">
                        Gitcord
                      </DialogTitle>
                      <ShieldCheck className="w-4 h-4 text-[#5BC898] fill-current" />
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      System Notification
                    </p>
                    <div className="flex items-center gap-2 text-sm text-neutral-400 dark:text-neutral-500 mt-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(selectedNotification.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="mt-4">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  {selectedNotification.subject}
                </h2>
                <div className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  <p className="whitespace-pre-wrap">
                    {selectedNotification.content}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <div>
                  {!selectedNotification.isRead && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkAsRead(selectedNotification.id)}
                    >
                      Mark as read
                    </Button>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() =>
                    handleDeleteNotification(selectedNotification.id)
                  }
                  className="cursor-pointer"
                >
                  <X className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Page;
