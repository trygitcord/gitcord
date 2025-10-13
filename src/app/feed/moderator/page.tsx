"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useUserProfile } from "@/hooks/useMyApiQueries";

// Define the User type from the API response
interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar_url: string;
  isModerator: boolean;
  bio?: string;
}
import {
  useGetUsers,
  useGetUserDetails,
  useSendMessage,
  useBroadcastMessage,
  useGetMessageStats,
} from "@/hooks/useMessageQueries";
import {
  Shield,
  Send,
  Users,
  Loader2,
  MessageSquare,
  AlertCircle,
  Mail,
  KeyRound,
  Search,
  Eye,
  UserCheck,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCreateCode,
  useGetCodes,
  useDeleteCode,
} from "@/hooks/useCodeQueries";
import { CodeType } from "@/models/code";
import { useGetFeedbacks, useDeleteFeedback } from "@/hooks/useFeedbackQueries";
import { getRelativeTime } from "@/lib/time-utils";

// BADGE renk fonksiyonu
const getTypeBadgeData = (type?: string) => {
  if (type === "bug")
    return { color: "bg-red-100 text-red-700 border-red-200", label: "Bug" };
  if (type === "feature")
    return {
      color: "bg-blue-100 text-blue-700 border-blue-200",
      label: "Feature",
    };
  if (type === "request")
    return {
      color: "bg-yellow-100 text-yellow-700 border-yellow-200",
      label: "Request",
    };
  return { color: "bg-gray-100 text-gray-700 border-gray-200", label: "Other" };
};

export default function ModeratorPage() {
  const router = useRouter();
  const { status: sessionStatus } = useSession();
  const { data: profile, isLoading: profileLoading } = useUserProfile();

  // State management
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [messageData, setMessageData] = useState({
    subject: "",
    content: "",
  });
  const [isCreateCodeModalOpen, setIsCreateCodeModalOpen] = useState(false);
  const [codeData, setCodeData] = useState({
    code: "",
    credit: 0,
    premium: false,
    premiumDays: 0,
    usageLimit: 1,
  });

  // Queries and mutations - search parametresi kaldırıldı, tüm kullanıcıları çekiyoruz
  const { data: usersData, isLoading: usersLoading } = useGetUsers(
    undefined,
    true
  );
  const { data: userDetails } = useGetUserDetails(
    selectedUserId && selectedUserId !== "all" ? selectedUserId : null
  );
  const { data: messageStats } = useGetMessageStats();
  const sendMessage = useSendMessage();
  const broadcastMessage = useBroadcastMessage();
  const createCode = useCreateCode();
  const { data: codesData, isLoading: codesLoading } = useGetCodes();
  const deleteCode = useDeleteCode();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserDetailModalOpen, setIsUserDetailModalOpen] = useState(false);
  const [feedbackPage, setFeedbackPage] = useState(1);
  const { data: feedbacksData, isLoading: feedbacksLoading } = useGetFeedbacks(
    feedbackPage,
    10
  );
  const deleteFeedback = useDeleteFeedback();
  const [deletingFeedbackId, setDeletingFeedbackId] = useState<string | null>(
    null
  );

  useEffect(() => {
    // If not authenticated, redirect to home
    if (sessionStatus === "unauthenticated") {
      router.push("/");
      return;
    }

    // If authenticated but not a moderator, redirect to dashboard
    if (sessionStatus === "authenticated" && profile && !profile.isModerator) {
      router.push("/feed/dashboard");
      return;
    }
  }, [sessionStatus, profile, router]);

  // Loading state
  if (sessionStatus === "loading" || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-500" />
      </div>
    );
  }

  // If not moderator, don't render anything (redirect will happen)
  if (!profile?.isModerator) {
    return null;
  }

  // Handlers
  const handleSendMessage = async () => {
    if (selectedUserId === "all") {
      await broadcastMessage.mutateAsync({
        subject: messageData.subject,
        content: messageData.content,
      });
    } else {
      await sendMessage.mutateAsync({
        recipientId: selectedUserId,
        subject: messageData.subject,
        content: messageData.content,
      });
    }

    // Reset form
    setMessageData({ subject: "", content: "" });
    setSelectedUserId("");
    setIsSendModalOpen(false);
  };

  const handleBroadcast = async () => {
    await broadcastMessage.mutateAsync({
      subject: messageData.subject,
      content: messageData.content,
    });

    // Reset form
    setMessageData({ subject: "", content: "" });
    setIsBroadcastModalOpen(false);
  };

  const handleCreateCode = async () => {
    await createCode.mutateAsync(codeData);
    setCodeData({
      code: "",
      credit: 0,
      premium: false,
      premiumDays: 0,
      usageLimit: 1,
    });
    setIsCreateCodeModalOpen(false);
  };

  // Email masking is now handled server-side for security
  // No need for client-side masking

  const filteredUsers =
    usersData?.data.users.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-neutral-600" />
          <div>
            <h1 className="text-xl font-medium text-neutral-900 dark:text-white">
              Moderator Panel
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              User management and messaging system
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-normal text-neutral-700 dark:text-neutral-300">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-medium text-neutral-900 dark:text-neutral-100">
              {messageStats?.data?.totalUsers ||
                usersData?.data.pagination.totalCount ||
                0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-normal text-neutral-700 dark:text-neutral-300">
              Total Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-medium text-neutral-900 dark:text-neutral-100">
              {messageStats?.data?.totalMessages || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-normal text-neutral-700 dark:text-neutral-300">
              Unread Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-medium text-neutral-900 dark:text-neutral-100">
              {messageStats?.data?.totalUnreadMessages || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="hover:shadow-sm transition-shadow duration-150">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-normal text-neutral-700 dark:text-neutral-300">
              <Send className="w-4 h-4" />
              Send Message
            </CardTitle>
            <CardDescription className="text-xs">
              Send a message to a specific user
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button
              size="sm"
              className="w-full bg-neutral-700 hover:bg-neutral-800 text-white text-xs"
              onClick={() => setIsSendModalOpen(true)}
            >
              <MessageSquare className="w-3 h-3 mr-1" />
              Compose Message
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-sm transition-shadow duration-150">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-normal text-neutral-700 dark:text-neutral-300">
              <Users className="w-4 h-4" />
              Broadcast Message
            </CardTitle>
            <CardDescription className="text-xs">
              Send a message to all users at once
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button
              size="sm"
              className="w-full bg-neutral-700 hover:bg-neutral-800 text-white text-xs"
              onClick={() => setIsBroadcastModalOpen(true)}
            >
              <Mail className="w-3 h-3 mr-1" />
              Broadcast to All
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Send Message Modal */}
      <Dialog open={isSendModalOpen} onOpenChange={setIsSendModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2">
              <Send className="w-4 h-4 text-neutral-600" />
              Send Message
            </DialogTitle>
            <DialogDescription className="text-sm">
              Send a message to a specific user or all users
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            {/* User Selection */}
            <div className="space-y-2">
              <Label htmlFor="user-select" className="text-sm">
                Select Recipient
              </Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger id="user-select" className="w-full">
                  <SelectValue placeholder="Choose a user or select all users" />
                </SelectTrigger>
                <SelectContent>
                  <Command>
                    <CommandInput placeholder="Search users..." />
                    <CommandEmpty>No users found.</CommandEmpty>
                    <CommandGroup>
                      {usersData?.data.allUsersOption && (
                        <CommandItem
                          value="all"
                          onSelect={() => setSelectedUserId("all")}
                        >
                          <Users className="mr-2 h-4 w-4 text-neutral-600" />
                          <span className="font-semibold">All Users</span>
                          <span className="ml-auto text-sm text-neutral-500">
                            {usersData.data.allUsersOption.userCount} users
                          </span>
                        </CommandItem>
                      )}
                      {usersLoading ? (
                        <div className="p-4 space-y-2">
                          <Skeleton className="h-10 w-full" />
                          <Skeleton className="h-10 w-full" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                      ) : (
                        usersData?.data.users.map((user) => (
                          <CommandItem
                            key={user.id}
                            value={user.id}
                            onSelect={() => setSelectedUserId(user.id)}
                          >
                            <Avatar className="mr-2 h-6 w-6">
                              <AvatarImage src={user.avatar_url} />
                              <AvatarFallback>
                                {user.name?.[0] || user.username[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium">{user.name}</span>
                              <span className="text-xs text-neutral-500">
                                @{user.username}
                              </span>
                            </div>
                            {user.isModerator && (
                              <Shield className="ml-auto h-4 w-4 text-neutral-600" />
                            )}
                          </CommandItem>
                        ))
                      )}
                    </CommandGroup>
                  </Command>
                </SelectContent>
              </Select>
            </div>

            {/* User Details Preview */}
            {userDetails && selectedUserId !== "all" && (
              <Card className="bg-neutral-50 dark:bg-neutral-900">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userDetails.data.user.avatar_url} />
                      <AvatarFallback className="text-xs">
                        {userDetails.data.user.name?.[0] ||
                          userDetails.data.user.username[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-sm">
                        {userDetails.data.user.name}
                      </h4>
                      <p className="text-xs text-neutral-500">
                        @{userDetails.data.user.username}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-neutral-500">Total Messages</span>
                      <p className="font-medium">
                        {userDetails.data.messageStats.totalMessagesReceived}
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-500">Unread</span>
                      <p className="font-medium">
                        {userDetails.data.messageStats.unreadMessages}
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-500">Status</span>
                      <p className="font-medium">
                        {userDetails.data.user.isModerator
                          ? "Moderator"
                          : "User"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Separator />

            {/* Message Form */}
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="subject" className="text-sm">
                  Subject
                </Label>
                <Input
                  id="subject"
                  placeholder="Enter message subject"
                  value={messageData.subject}
                  onChange={(e) =>
                    setMessageData({ ...messageData, subject: e.target.value })
                  }
                  className="text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="content" className="text-sm">
                  Message Content
                </Label>
                <Textarea
                  id="content"
                  placeholder="Type your message here..."
                  rows={4}
                  value={messageData.content}
                  onChange={(e) =>
                    setMessageData({ ...messageData, content: e.target.value })
                  }
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSendModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-neutral-700 hover:bg-neutral-800 text-white"
              onClick={handleSendMessage}
              disabled={
                !selectedUserId ||
                !messageData.subject ||
                !messageData.content ||
                sendMessage.isPending ||
                broadcastMessage.isPending
              }
            >
              {sendMessage.isPending || broadcastMessage.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Broadcast Modal */}
      <Dialog
        open={isBroadcastModalOpen}
        onOpenChange={setIsBroadcastModalOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Users className="w-6 h-6 text-neutral-600" />
              Broadcast Message
            </DialogTitle>
            <DialogDescription>
              Send a message to all {usersData?.data.pagination.totalCount || 0}{" "}
              users at once
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Alert */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div className="text-sm text-amber-800 dark:text-amber-200">
                <p className="font-semibold mb-1">Important Notice</p>
                <p>
                  This message will be sent to all users in the system. Please
                  ensure the content is appropriate for everyone.
                </p>
              </div>
            </div>

            {/* Message Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="broadcast-subject">Subject</Label>
                <Input
                  id="broadcast-subject"
                  placeholder="Enter message subject"
                  value={messageData.subject}
                  onChange={(e) =>
                    setMessageData({ ...messageData, subject: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="broadcast-content">Message Content</Label>
                <Textarea
                  id="broadcast-content"
                  placeholder="Type your message here..."
                  rows={6}
                  value={messageData.content}
                  onChange={(e) =>
                    setMessageData({ ...messageData, content: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBroadcastModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-neutral-700 hover:bg-neutral-800 text-white"
              onClick={handleBroadcast}
              disabled={
                !messageData.subject ||
                !messageData.content ||
                broadcastMessage.isPending
              }
            >
              {broadcastMessage.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Broadcasting...
                </>
              ) : (
                <>
                  <Users className="w-4 h-4 mr-2" />
                  Broadcast to All
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Code Modal */}
      <Dialog
        open={isCreateCodeModalOpen}
        onOpenChange={setIsCreateCodeModalOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <KeyRound className="w-6 h-6 text-neutral-600" />
              Create Code
            </DialogTitle>
            <DialogDescription>
              Create a new code for premium or credit rewards.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  placeholder="Enter code (e.g. GITCORD2024)"
                  value={codeData.code}
                  onChange={(e) =>
                    setCodeData({
                      ...codeData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credit">Credit</Label>
                <Input
                  id="credit"
                  type="number"
                  min={0}
                  value={codeData.credit}
                  onChange={(e) =>
                    setCodeData({ ...codeData, credit: Number(e.target.value) })
                  }
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="space-y-2 flex-1">
                  <Label htmlFor="premium">Premium</Label>
                  <Select
                    value={codeData.premium ? "true" : "false"}
                    onValueChange={(val) =>
                      setCodeData({ ...codeData, premium: val === "true" })
                    }
                  >
                    <SelectTrigger id="premium" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">No</SelectItem>
                      <SelectItem value="true">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 flex-1">
                  <Label htmlFor="premiumDays">Premium Days</Label>
                  <Input
                    id="premiumDays"
                    type="number"
                    min={0}
                    value={codeData.premiumDays}
                    onChange={(e) =>
                      setCodeData({
                        ...codeData,
                        premiumDays: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="usageLimit">Usage Limit</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  min={1}
                  value={codeData.usageLimit}
                  onChange={(e) =>
                    setCodeData({
                      ...codeData,
                      usageLimit: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateCodeModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-neutral-700 hover:bg-neutral-800 text-white"
              onClick={handleCreateCode}
              disabled={
                !codeData.code || codeData.credit < 0 || createCode.isPending
              }
            >
              {createCode.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 mr-2" />
                  Create Code
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Users Management Section */}
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <Users className="w-4 h-4 text-neutral-600" />
            User Management
          </CardTitle>
          <CardDescription className="text-xs">
            View and manage all users
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <Input
                placeholder="Search users (name, username, email)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Users Grid */}
          {usersLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="p-3">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-2 w-24" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {filteredUsers.map((user) => (
                <Card
                  key={user.id}
                  className="hover:shadow-sm transition-shadow duration-150 hover:border-neutral-300"
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2 flex-1">
                        <div className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={user.avatar_url}
                              className="blur-[1px] hover:blur-none transition-all duration-200"
                            />
                            <AvatarFallback className="text-xs">
                              {user.name?.[0] || user.username[0]}
                            </AvatarFallback>
                          </Avatar>
                          {user.isModerator && (
                            <div className="absolute -top-0.5 -right-0.5 bg-neutral-600 rounded-full p-0.5">
                              <Shield className="w-2 h-2 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-xs truncate">
                            {user.name || "No name"}
                          </h3>
                          <p className="text-xs text-neutral-500 truncate">
                            @{user.username}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsUserDetailModalOpen(true);
                        }}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-neutral-400 truncate">
                        {user.email || "No email"}
                      </span>
                      <div className="flex items-center gap-1">
                        {user.isModerator && (
                          <span className="bg-neutral-600 text-white px-1.5 py-0.5 rounded text-xs">
                            MOD
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!usersLoading && filteredUsers.length === 0 && (
            <div className="text-center text-neutral-500 py-8">
              {searchTerm
                ? "No users found matching search criteria."
                : "No users found."}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feedbacks Section */}
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-neutral-600" />
            User Feedbacks
          </CardTitle>
          <CardDescription className="text-sm">
            User feedback submissions
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Feedbacks List */}
          {feedbacksLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="p-4">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : feedbacksData?.data?.feedbacks?.length === 0 ? (
            <div className="text-center text-neutral-500 py-8">
              No feedbacks found.
            </div>
          ) : (
            <div className="space-y-3">
              {feedbacksData?.data?.feedbacks?.map((feedback) => (
                <Card
                  key={feedback._id}
                  className="hover:shadow-sm transition-shadow duration-150"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarImage src={feedback.user?.avatar_url} />
                        <AvatarFallback className="text-sm">
                          {(feedback.user?.username ||
                            feedback.username)[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 max-w-full overflow-hidden">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex flex-col">
                            <span className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
                              {feedback.user?.name || "Unknown User"}
                            </span>
                            <span className="text-xs text-neutral-500">
                              @{feedback.user?.username || feedback.username}
                            </span>
                          </div>
                          <span
                            className={`text-xs border rounded px-2 py-0.5 ml-2 ${
                              getTypeBadgeData(feedback.type).color
                            }`}
                          >
                            {getTypeBadgeData(feedback.type).label}
                          </span>
                          <span className="text-xs text-neutral-400 ml-3">
                            {getRelativeTime(feedback.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-700 dark:text-neutral-300 break-words whitespace-pre-wrap overflow-wrap-anywhere">
                          {feedback.message}
                        </p>
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 bg-neutral-100 hover:bg-neutral-200 border-neutral-200 hover:border-neutral-300 text-neutral-600 hover:text-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:border-neutral-700 dark:hover:border-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-300 cursor-pointer"
                          disabled={
                            deleteFeedback.isPending &&
                            deletingFeedbackId === feedback._id
                          }
                          onClick={() => {
                            if (
                              window.confirm(
                                `Are you sure you want to delete this feedback from @${
                                  feedback.user?.username || feedback.username
                                }?`
                              )
                            ) {
                              setDeletingFeedbackId(feedback._id);
                              deleteFeedback.mutate(feedback._id, {
                                onSettled: () => setDeletingFeedbackId(null),
                              });
                            }
                          }}
                        >
                          {deleteFeedback.isPending &&
                          deletingFeedbackId === feedback._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {feedbacksData?.data?.pagination &&
            feedbacksData.data.pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="text-sm text-neutral-500">
                  Page {feedbacksData.data.pagination.page} of{" "}
                  {feedbacksData.data.pagination.totalPages}(
                  {feedbacksData.data.pagination.total} total)
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={feedbackPage === 1}
                    onClick={() => setFeedbackPage(feedbackPage - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={
                      feedbackPage === feedbacksData.data.pagination.totalPages
                    }
                    onClick={() => setFeedbackPage(feedbackPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
        </CardContent>
      </Card>

      {/* Create Code Section */}
      <Card className="hover:shadow-sm transition-shadow duration-150 cursor-pointer mt-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-normal text-neutral-700 dark:text-neutral-300">
            <KeyRound className="w-4 h-4" />
            Create Code
          </CardTitle>
          <CardDescription className="text-xs">
            Create a new code for users
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Button
            size="sm"
            className="w-full bg-neutral-700 hover:bg-neutral-800 text-white text-xs"
            onClick={() => setIsCreateCodeModalOpen(true)}
          >
            <KeyRound className="w-3 h-3 mr-1" />
            Create Code
          </Button>
        </CardContent>
      </Card>

      {/* User Detail Modal */}
      <Dialog
        open={isUserDetailModalOpen}
        onOpenChange={setIsUserDetailModalOpen}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-neutral-600" />
              User Details
            </DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6 py-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar_url} />
                  <AvatarFallback className="text-lg">
                    {selectedUser.name?.[0] || selectedUser.username[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    {selectedUser.name || "Name not specified"}
                    {selectedUser.isModerator && (
                      <Shield className="w-5 h-5 text-neutral-600" />
                    )}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    @{selectedUser.username}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {selectedUser.email || "Email not specified"}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-neutral-700 dark:text-neutral-300">
                    {selectedUser.id}
                  </div>
                  <div className="text-sm text-neutral-500">User ID</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-neutral-700 dark:text-neutral-300">
                    {selectedUser.isModerator ? "Yes" : "No"}
                  </div>
                  <div className="text-sm text-neutral-500">Moderator</div>
                </div>
              </div>

              {selectedUser.bio && (
                <div>
                  <h4 className="font-semibold mb-2">Bio</h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800 p-3 rounded">
                    {selectedUser.bio}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <h4 className="font-semibold">Account Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-neutral-500">Username:</span>
                    <p>@{selectedUser.username}</p>
                  </div>
                  <div>
                    <span className="text-neutral-500">Email:</span>
                    <p>{selectedUser.email || "Email not specified"}</p>
                  </div>
                  <div>
                    <span className="text-neutral-500">Moderator:</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded text-xs ${
                        selectedUser.isModerator
                          ? "bg-neutral-600 text-white"
                          : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                      }`}
                    >
                      {selectedUser.isModerator ? "Yes" : "No"}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Status:</span>
                    <span className="ml-2 px-2 py-1 rounded text-xs bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUserDetailModalOpen(false)}
            >
              Close
            </Button>
            {selectedUser && (
              <Button
                className="bg-neutral-700 hover:bg-neutral-800 text-white"
                onClick={() => {
                  setSelectedUserId(selectedUser.id);
                  setIsUserDetailModalOpen(false);
                  setIsSendModalOpen(true);
                }}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Created Codes Table */}
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-neutral-600" />
            Created Codes
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {codesLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="w-5 h-5 animate-spin text-neutral-500" />
            </div>
          ) : codesData?.data?.length === 0 ? (
            <div className="text-center text-neutral-500 py-6 text-sm">
              No codes found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs border">
                <thead>
                  <tr className="bg-neutral-50 dark:bg-neutral-800">
                    <th className="px-3 py-2 text-left font-medium">Code</th>
                    <th className="px-3 py-2 text-left font-medium">Credit</th>
                    <th className="px-3 py-2 text-left font-medium">Premium</th>
                    <th className="px-3 py-2 text-left font-medium">
                      Premium Days
                    </th>
                    <th className="px-3 py-2 text-left font-medium">
                      Usage Limit
                    </th>
                    <th className="px-3 py-2 text-left font-medium">Used</th>
                    <th className="px-3 py-2 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {codesData?.data?.map((code: CodeType) => (
                    <tr
                      key={code._id}
                      className="border-b hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50"
                    >
                      <td className="px-3 py-2 font-mono text-xs">
                        {code.code}
                      </td>
                      <td className="px-3 py-2">{code.credit}</td>
                      <td className="px-3 py-2">
                        {code.premium ? "Yes" : "No"}
                      </td>
                      <td className="px-3 py-2">{code.premiumDays}</td>
                      <td className="px-3 py-2">{code.usageLimit}</td>
                      <td className="px-3 py-2">{code.usedCount}</td>
                      <td className="px-3 py-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          disabled={
                            !code._id ||
                            (deleteCode.isPending && deletingId === code._id)
                          }
                          onClick={() => {
                            if (
                              code._id &&
                              window.confirm(
                                `Are you sure you want to delete code '${code.code}'?`
                              )
                            ) {
                              setDeletingId(code._id);
                              deleteCode.mutate(code._id, {
                                onSettled: () => setDeletingId(null),
                              });
                            }
                          }}
                        >
                          {deleteCode.isPending && deletingId === code._id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            "Delete"
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
