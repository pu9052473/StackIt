"use client";

import React, { useEffect, useState } from "react";
import { Bell, X, Clock, MessageCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

// Notification type
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

// ✅ Real-time notification hook
export const useRealtimeNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    // Fetch initial notifications
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`/api/notification?userId=${user.id}`);
        const data = await res.json();
        setNotifications(data.notifications || []);
      } catch (err) {
        console.error("Failed to fetch initial notifications", err);
      }
    };

    fetchNotifications();

    // Subscribe to Supabase real-time
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Notification",
          filter: `userId=eq.${user.id}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications((prev) => [newNotification, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return notifications;
};

// ✅ Notification Dialog UI
const NotificationDialog = ({
  isOpen,
  onClose,
  notifications,
}: NotificationDialogProps) => {
  const formatTimeAgo = (dateString: string) => {
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
              {notifications.map((notification) => (
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

// ✅ Main Page
const NotificationPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const notifications = useRealtimeNotifications();

  const unreadCount = notifications.length;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
            Notifications
          </h1>

          <button
            onClick={() => setIsDialogOpen(true)}
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
              onClick={() => setIsDialogOpen(true)}
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

      {/* Real-time Notification Dialog */}
      <NotificationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        notifications={notifications}
      />
    </div>
  );
};

export default NotificationPage;
