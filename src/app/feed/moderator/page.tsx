"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useUserProfile } from "@/hooks/useMyApiQueries";
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

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-[#5BC898]" />
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
              Moderator Panel
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Manage messages and user communications
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              {messageStats?.data?.totalUsers ||
                usersData?.data.pagination.totalCount ||
                0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
              Total User Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              {messageStats?.data?.totalMessages || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
              Total Unread Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              {messageStats?.data?.totalUnreadMessages || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 group-hover:text-[#5BC898] transition-colors">
              <KeyRound className="w-5 h-5" />
              Create Code
            </CardTitle>
            <CardDescription>Create a new code for users</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full bg-[#5BC898] hover:bg-[#4BA87B] text-white"
              onClick={() => setIsCreateCodeModalOpen(true)}
            >
              <KeyRound className="w-4 h-4 mr-2" />
              Create Code
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 group-hover:text-[#5BC898] transition-colors">
              <Send className="w-5 h-5" />
              Send Message
            </CardTitle>
            <CardDescription>Send a message to a specific user</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full bg-[#5BC898] hover:bg-[#4BA87B] text-white"
              onClick={() => setIsSendModalOpen(true)}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Compose Message
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 group-hover:text-[#5BC898] transition-colors">
              <Users className="w-5 h-5" />
              Broadcast Message
            </CardTitle>
            <CardDescription>
              Send a message to all users at once
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full bg-[#5BC898] hover:bg-[#4BA87B] text-white"
              onClick={() => setIsBroadcastModalOpen(true)}
            >
              <Mail className="w-4 h-4 mr-2" />
              Broadcast to All
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Send Message Modal */}
      <Dialog open={isSendModalOpen} onOpenChange={setIsSendModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Send className="w-6 h-6 text-[#5BC898]" />
              Send Message
            </DialogTitle>
            <DialogDescription>
              Send a message to a specific user or all users
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* User Selection */}
            <div className="space-y-2">
              <Label htmlFor="user-select">Select Recipient</Label>
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
                          <Users className="mr-2 h-4 w-4 text-[#5BC898]" />
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
                              <Shield className="ml-auto h-4 w-4 text-[#5BC898]" />
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
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={userDetails.data.user.avatar_url} />
                      <AvatarFallback>
                        {userDetails.data.user.name?.[0] ||
                          userDetails.data.user.username[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">
                        {userDetails.data.user.name}
                      </h4>
                      <p className="text-sm text-neutral-500">
                        @{userDetails.data.user.username}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-neutral-500">Total Messages</span>
                      <p className="font-semibold">
                        {userDetails.data.messageStats.totalMessagesReceived}
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-500">Unread</span>
                      <p className="font-semibold">
                        {userDetails.data.messageStats.unreadMessages}
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-500">Status</span>
                      <p className="font-semibold">
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
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Enter message subject"
                  value={messageData.subject}
                  onChange={(e) =>
                    setMessageData({ ...messageData, subject: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Message Content</Label>
                <Textarea
                  id="content"
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
            <Button variant="outline" onClick={() => setIsSendModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#5BC898] hover:bg-[#4BA87B] text-white"
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
              <Users className="w-6 h-6 text-[#5BC898]" />
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
              className="bg-[#5BC898] hover:bg-[#4BA87B] text-white"
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
              <KeyRound className="w-6 h-6 text-[#5BC898]" />
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
              className="bg-[#5BC898] hover:bg-[#4BA87B] text-white"
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

      {/* Codes Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-lg shadow p-6 mt-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-[#5BC898]" />
          Created Codes
        </h2>
        {codesLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
          </div>
        ) : codesData?.data?.length === 0 ? (
          <div className="text-center text-neutral-500 py-8">
            No codes found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead>
                <tr className="bg-neutral-100 dark:bg-neutral-800">
                  <th className="px-4 py-2 text-left">Code</th>
                  <th className="px-4 py-2 text-left">Credit</th>
                  <th className="px-4 py-2 text-left">Premium</th>
                  <th className="px-4 py-2 text-left">Premium Days</th>
                  <th className="px-4 py-2 text-left">Usage Limit</th>
                  <th className="px-4 py-2 text-left">Used</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {codesData?.data?.map((code: CodeType) => (
                  <tr key={code._id} className="border-b">
                    <td className="px-4 py-2 font-mono">{code.code}</td>
                    <td className="px-4 py-2">{code.credit}</td>
                    <td className="px-4 py-2">{code.premium ? "Yes" : "No"}</td>
                    <td className="px-4 py-2">{code.premiumDays}</td>
                    <td className="px-4 py-2">{code.usageLimit}</td>
                    <td className="px-4 py-2">{code.usedCount}</td>
                    <td className="px-4 py-2">
                      <Button
                        variant="destructive"
                        size="sm"
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
                          <Loader2 className="w-4 h-4 animate-spin" />
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
      </div>
    </div>
  );
}
