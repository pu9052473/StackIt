import { motion } from "framer-motion";
import { Bot } from "lucide-react";

const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded ${className}`} />
);

export const MainContentSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-border rounded-3xl p-6 lg:p-8">
      <div className="bg-muted rounded-2xl p-6">
        <div className="h-6 bg-border rounded mb-3"></div>
        <div className="h-4 bg-border rounded mb-2"></div>
        <div className="h-4 bg-border rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-border rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

export const AnalysisPanelSkeleton = () => (
  <div className="animate-pulse bg-border rounded-3xl p-6 lg:p-8">
    <div className="h-8 bg-muted rounded mb-6"></div>
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 bg-muted rounded-xl">
          <div className="w-10 h-10 bg-border rounded-lg"></div>
          <div className="h-4 bg-border rounded flex-1"></div>
        </div>
      ))}
    </div>
  </div>
);

export const ChatBotSkeleton = () => {
  return (
    <div className="bg-background-primary dark:bg-background-secondary border border-slate-700 rounded-3xl shadow-xl overflow-hidden">
      {/* Header Skeleton */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-10 h-10 rounded-full bg-slate-600" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-24 bg-slate-600" />
            <Skeleton className="h-4 w-32 bg-slate-600" />
          </div>
        </div>
      </div>

      {/* Chat Messages Skeleton */}
      <div className="h-64 lg:h-80 p-4 space-y-4">
        {/* AI Message Skeleton */}
        <div className="flex items-start space-x-3">
          <Skeleton className="w-8 h-8 rounded-full bg-slate-600" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-48 bg-slate-600" />
            <Skeleton className="h-4 w-36 bg-slate-600" />
          </div>
        </div>

        {/* User Message Skeleton */}
        <div className="flex items-start space-x-3 flex-row-reverse space-x-reverse">
          <Skeleton className="w-8 h-8 rounded-full bg-slate-600" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 bg-slate-600" />
          </div>
        </div>

        {/* Another AI Message Skeleton */}
        <div className="flex items-start space-x-3">
          <Skeleton className="w-8 h-8 rounded-full bg-slate-600" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-40 bg-slate-600" />
            <Skeleton className="h-4 w-44 bg-slate-600" />
            <Skeleton className="h-4 w-28 bg-slate-600" />
          </div>
        </div>
      </div>

      {/* Input Skeleton */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-3">
          <Skeleton className="flex-1 h-12 rounded-xl bg-slate-600" />
          <Skeleton className="w-10 h-10 rounded-xl bg-slate-600" />
        </div>
      </div>
    </div>
  );
};

// AI Loading Animation Component
export const AILoadingAnimation = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start space-x-3"
    >
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="max-w-xs lg:max-w-sm p-3 rounded-2xl bg-slate-700 text-slate-200">
        <div className="flex items-center space-x-2 text-sm">
          <span>Generating AI response</span>
          <div className="flex space-x-1">
            <motion.div
              className="w-1 h-1 bg-slate-400 rounded-full"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="w-1 h-1 bg-slate-400 rounded-full"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="w-1 h-1 bg-slate-400 rounded-full"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const SideBarProjectSkeleton = ({ isSideBarOpen }: { isSideBarOpen: boolean }) => (
  <div className="w-full flex-col gap-2 px-2 sm:px-3 py-3 sm:py-4">
    {[...Array(3)].map((_, index) => (
      <div
        key={index}
        className="group relative flex items-center w-full h-9 px-2 sm:px-3 py-2 sm:py-3 rounded-lg animate-pulse"
      >
        <div className="flex items-center w-full gap-2 sm:gap-3">
          {isSideBarOpen ? (
            <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded w-3/4"></div>
          ) : (
            <div className="h-4 w-4 bg-gray-300 dark:bg-zinc-700 rounded"></div>
          )}
        </div>
      </div>
    ))}
  </div>
);

export const ProfileSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background-DEFAULT transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Skeleton className="bg-slate-200 dark:bg-slate-600 h-10 w-32 mb-2" />
              <Skeleton className="bg-slate-200 dark:bg-slate-600 h-5 w-48" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          {/* Profile Card */}
          <div className="xl:col-span-3">
            <div className="dark:bg-card-dark bg-card border border-border-DEFAULT rounded-3xl shadow-lg">
              {/* Profile Header */}
              <div className="p-5">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    <Skeleton className="bg-slate-200 dark:bg-slate-600 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl" />
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="space-y-3">
                          <Skeleton className="bg-slate-200 dark:bg-slate-600 h-8 w-48" />
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex items-center gap-2">
                              <Skeleton className="bg-slate-200 dark:bg-slate-600 w-4 h-4 rounded" />
                              <Skeleton className="bg-slate-200 dark:bg-slate-600 h-4 w-32" />
                            </div>
                            <div className="flex items-center gap-2">
                              <Skeleton className="bg-slate-200 dark:bg-slate-600 w-4 h-4 rounded" />
                              <Skeleton className="bg-slate-200 dark:bg-slate-600 h-4 w-24" />
                            </div>
                            <div className="flex items-center gap-2">
                              <Skeleton className="bg-slate-200 dark:bg-slate-600 w-4 h-4 rounded" />
                              <Skeleton className="bg-slate-200 dark:bg-slate-600 h-4 w-28" />
                            </div>
                            <div className="flex items-center gap-2">
                              <Skeleton className="bg-slate-200 dark:bg-slate-600 w-4 h-4 rounded" />
                              <Skeleton className="bg-slate-200 dark:bg-slate-600 h-4 w-20" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex-shrink-0">
                        <Skeleton className="bg-slate-200 dark:bg-slate-600 h-10 w-32 rounded-xl" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="border-t border-border-DEFAULT p-5">
                <Skeleton className="bg-slate-200 dark:bg-slate-600 h-6 w-16 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="bg-slate-200 dark:bg-slate-600 h-4 w-full" />
                  <Skeleton className="bg-slate-200 dark:bg-slate-600 h-4 w-4/5" />
                  <Skeleton className="bg-slate-200 dark:bg-slate-600 h-4 w-3/5" />
                </div>
              </div>

              {/* Social Links Section */}
              <div className="border-t border-border-DEFAULT p-5">
                <Skeleton className="bg-slate-200 dark:bg-slate-600 h-6 w-24 mb-4" />
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: item * 0.1 }}
                      className="flex items-center gap-3 p-4 dark:bg-input-dark bg-input rounded-xl"
                    >
                      <Skeleton className="bg-slate-200 dark:bg-slate-600 w-5 h-5 rounded" />
                      <div className="flex-1 min-w-0 space-y-2">
                        <Skeleton className="bg-slate-200 dark:bg-slate-600 h-4 w-24" />
                        <Skeleton className="bg-slate-200 dark:bg-slate-600 h-3 w-48" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Account Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="dark:bg-card-dark bg-card border border-border-DEFAULT rounded-3xl p-6 shadow-lg"
            >
              <Skeleton className="bg-slate-200 dark:bg-slate-600 h-6 w-24 mb-4" />
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="bg-slate-200 dark:bg-slate-600 w-10 h-10 rounded-xl" />
                  <div className="flex-1 min-w-0 space-y-2">
                    <Skeleton className="bg-slate-200 dark:bg-slate-600 h-3 w-20" />
                    <Skeleton className="bg-slate-200 dark:bg-slate-600 h-4 w-24" />
                  </div>
                </div>
              </div>
            </motion.div>            
          </div>
        </div>
      </div>
    </motion.div>
  );
};