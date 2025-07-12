"use client"

import React, { useState } from "react";
import { Bell, X, Clock, MessageCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Notification = {
  id: number;
  questionId: number;
  userId: string;
  description: string;
  createdAt: string;
  question?: {
    id: number;
    title: string;
    description: string;
  };
};

type NotificationDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
};

// Mock data - replace with actual API call
const mockNotifications = [
  {
    id: 1,
    questionId: 101,
    userId: "user123",
    description:
      "You were mentioned in a question about React hooks and performance optimization",
    createdAt: "2025-01-15T10:30:00Z",
    question: {
      id: 101,
      title: "How to optimize React hooks performance?",
      description: "I need help with optimizing my React hooks...",
    },
  },
  {
    id: 2,
    questionId: 102,
    userId: "user123",
    description:
      "You were mentioned in a question about database design patterns",
    createdAt: "2025-01-14T15:45:00Z",
    question: {
      id: 102,
      title: "Best practices for database schema design",
      description: "What are the best practices for designing...",
    },
  },
  {
    id: 3,
    questionId: 103,
    userId: "user123",
    description: "You were mentioned in a question about API authentication",
    createdAt: "2025-01-13T09:15:00Z",
    question: {
      id: 103,
      title: "JWT vs Session-based authentication",
      description: "Which authentication method is better...",
    },
  },
  {
    id: 4,
    questionId: 104,
    userId: "user123",
    description: "You were mentioned in a question about frontend frameworks",
    createdAt: "2025-01-12T14:20:00Z",
    question: {
      id: 104,
      title: "React vs Vue.js comparison",
      description: "I'm trying to decide between React and Vue...",
    },
  },
  {
    id: 5,
    questionId: 105,
    userId: "user123",
    description: "You were mentioned in a question about deployment strategies",
    createdAt: "2025-01-11T11:30:00Z",
    question: {
      id: 105,
      title: "Docker deployment best practices",
      description: "What are the best practices for Docker...",
    },
  },
];
const fetchNotifications = async (userId: string) => {
  const response = await fetch(`/api/notification?userId=${userId}`,);

  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }

  const data = await response.json();
  return data.notifications || [];
};

// Custom hook for notifications - replace with actual useQuery
const useNotifications = (userId: string) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simulate API call
  const data = mockNotifications.filter(
    (notification) => notification.userId === userId
  );

  // For actual implementation, replace with:
  // const { data, isLoading, error } = useQuery({
  //   queryKey: ['notifications', user?.id],
  //   queryFn: () => fetchNotifications(user?.id as tring),
  //   enabled: !!user?.id,
  // });

  return { data, isLoading, error };
};

// Dialog component using shadcn/ui structure
const NotificationDialog = ({
  isOpen,
  onClose,
  notifications,
}: NotificationDialogProps) => {
  interface FormatTimeAgo {
    (dateString: string): string;
  }

  const formatTimeAgo: FormatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md max-h-[80vh] bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Notifications
            </h2>
            {notifications.length > 0 && (
              <span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                {notifications.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Bell className="w-12 h-12 text-zinc-400 dark:text-zinc-600 mb-4" />
              <p className="text-zinc-600 dark:text-zinc-400 text-center">
                No notifications yet
              </p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {notifications.map((notification: any) => (
                <div
                  key={notification.id}
                  className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-900 dark:text-white leading-relaxed">
                        {notification.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                      </div>
                      {notification.question && (
                        <div className="mt-2 p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-md">
                          <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                            {notification.question.title}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const NotificationPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const currentUserId = "user123"; // Replace with actual current user ID

  const {
    data: notifications,
    isLoading,
    error,
  } = useNotifications(currentUserId);

  const handleNotificationClick = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
        <div className="text-zinc-600 dark:text-zinc-400">
          Loading notifications...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
        <div className="text-red-600 dark:text-red-400">
          Error loading notifications
        </div>
      </div>
    );
  }

  const unreadCount = notifications?.length || 0;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
            Notifications
          </h1>

          {/* Notification Button */}
          <button
            onClick={handleNotificationClick}
            className="relative p-3 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-700 transition-all duration-200 hover:shadow-xl"
          >
            <Bell className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Page Content */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-6 sm:p-8">
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-zinc-400 dark:text-zinc-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
              Stay Updated
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              Click the notification button to see your latest mentions and
              updates
            </p>
            <button
              onClick={handleNotificationClick}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Bell className="w-4 h-4" />
              View Notifications
              {unreadCount > 0 && (
                <span className="px-2 py-1 bg-purple-500 text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Notification Dialog */}
      <NotificationDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        notifications={notifications || []}
      />
    </div>
  );
};

export default NotificationPage;
