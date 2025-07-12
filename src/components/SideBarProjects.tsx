// "use client";
// import { useAuth } from "@/context/AuthContext";
// import { Project } from "@prisma/client";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import React from "react";
// import { AlertCircle, RefreshCw, FolderOpen } from "lucide-react";
// import { SideBarProjectSkeleton } from "./(common)/skeleton";

// const fetchProjects = async () => {
//   const res = await axios.get(`/api/project`, { params: { count: 5 } });
//   return res.data;
// };

// // Skeleton component for loading state

// // Error component
// const ProjectError = ({
//   onRetry,
//   isSideBarOpen,
// }: {
//   onRetry: () => void;
//   isSideBarOpen: boolean;
// }) => (
//   <div className="w-full flex-col gap-2 px-2 sm:px-3 py-3 sm:py-4">
//     <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
//       <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400 mb-3" />
//       {isSideBarOpen && (
//         <>
//           <p className="text-sm text-gray-600 dark:text-foreground-muted mb-3">
//             Failed to load projects
//           </p>
//           <button
//             onClick={onRetry}
//             className="flex items-center gap-2 px-3 py-1.5 text-xs bg-primary hover:bg-primary-600 text-white rounded-md transition-colors duration-200"
//           >
//             <RefreshCw className="w-3 h-3" />
//             Retry
//           </button>
//         </>
//       )}
//     </div>
//   </div>
// );

// // Empty state component
// const EmptyProjects = ({ isSideBarOpen }: { isSideBarOpen: boolean }) => (
//   <div className="w-full flex-col gap-2 px-2 sm:px-3 py-3 sm:py-4">
//     <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
//       <FolderOpen className="w-8 h-8 text-gray-400 dark:text-zinc-600 mb-3" />
//       {isSideBarOpen && (
//         <p className="text-sm text-gray-500 dark:text-foreground-muted">
//           No projects yet
//         </p>
//       )}
//     </div>
//   </div>
// );

// export default function SideBarProjects({
//   isSideBarOpen,
// }: {
//   isSideBarOpen: boolean;
// }) {
//   const { user } = useAuth();
//   const pathName = usePathname();

//   const { data, isLoading, isError, refetch } = useQuery({
//     queryKey: ["SidebarProjects"],
//     queryFn: () => fetchProjects(),
//     enabled: !!user?.id,
//     retry: 2,
//     staleTime: 1000 * 60 * 5, // 5 minutes
//   });

//   // Loading state
//   if (isLoading) {
//     return <SideBarProjectSkeleton isSideBarOpen={isSideBarOpen} />;
//   }

//   // Error state
//   if (isError) {
//     return <ProjectError onRetry={refetch} isSideBarOpen={isSideBarOpen} />;
//   }

//   // Empty state
//   if (!data.projects || data.projects.length === 0) {
//     return <EmptyProjects isSideBarOpen={isSideBarOpen} />;
//   }

//   return (
//     <div className="w-full flex-col gap-2 px-2 sm:px-3 py-3 sm:py-4">
//       <h1>Recent Projects</h1>
//       <div className="space-y-1">
//         {data.projects &&
//           data.projects.map((project: Project) => {
//             const projectUrl = `/projects/${project.id}`;
//             const isActive =
//               pathName === projectUrl || pathName.startsWith(projectUrl + "/");

//             return (
//               <div
//                 key={project.id}
//                 className={`
//                 group relative flex items-center w-full h-10 px-2 sm:px-3 py-2 sm:py-3 rounded-lg
//                 transition-all duration-200 ease-in-out
//                 ${
//                   isActive
//                     ? "bg-primary text-white shadow-lg shadow-primary/20 dark:bg-primary dark:text-white"
//                     : "text-gray-600 hover:bg-primary-50 dark:text-foreground-muted dark:hover:bg-zinc-800/50 hover:text-primary-700 dark:hover:text-white"
//                 }
//               `}
//               >
//                 <Link
//                   href={projectUrl}
//                   className={`
//                   flex items-center w-full gap-2 sm:gap-3
//                   transition-colors duration-200
//                   ${
//                     isActive
//                       ? "text-white"
//                       : "text-gray-600 hover:text-primary-700 dark:text-foreground-muted dark:hover:text-white"
//                   }
//                 `}
//                   title={isSideBarOpen ? project.title : project.title}
//                 >
//                   {isSideBarOpen ? (
//                     <span className="text-sm font-medium truncate">
//                       {project.title}
//                     </span>
//                   ) : (
//                     <div className="w-6 h-6 rounded-md bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
//                       <span className="text-xs font-semibold text-primary-700 dark:text-primary-300">
//                         {project.title.slice(0, 1).toUpperCase()}
//                       </span>
//                     </div>
//                   )}
//                 </Link>

//                 {/* Hover tooltip for collapsed sidebar */}
//                 {!isSideBarOpen && (
//                   <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-zinc-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
//                     {project.title}
//                     <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900 dark:border-r-zinc-800"></div>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//       </div>
//     </div>
//   );
// }

"use client";
import { useAuth } from "@/context/AuthContext";
import { Project } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { AlertCircle, RefreshCw, FolderOpen } from "lucide-react";
import { SideBarProjectSkeleton } from "./(common)/skeleton";

// Fetcher
const fetchProjects = async () => {
  const res = await axios.get(`/api/project`, { params: { count: 5 } });
  return res.data;
};

// Error UI
const ProjectError = ({
  onRetry,
  isSideBarOpen,
}: {
  onRetry: () => void;
  isSideBarOpen: boolean;
}) => (
  <div className="w-full px-3 py-4">
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400 mb-3" />
      {isSideBarOpen && (
        <>
          <p className="text-sm text-gray-600 dark:text-zinc-400 mb-3">
            Failed to load projects
          </p>
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-3 py-1.5 text-xs bg-primary hover:bg-primary-600 text-white rounded-md transition"
          >
            <RefreshCw className="w-3 h-3" />
            Retry
          </button>
        </>
      )}
    </div>
  </div>
);

// Empty UI
const EmptyProjects = ({ isSideBarOpen }: { isSideBarOpen: boolean }) => (
  <div className="w-full px-3 py-4">
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <FolderOpen className="w-8 h-8 text-gray-400 dark:text-zinc-600 mb-3" />
      {isSideBarOpen && (
        <p className="text-sm text-gray-500 dark:text-zinc-400">
          No projects yet
        </p>
      )}
    </div>
  </div>
);

// Main Component
export default function SideBarProjects({
  isSideBarOpen,
}: {
  isSideBarOpen: boolean;
}) {
  const { user } = useAuth();
  const pathName = usePathname();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["SidebarProjects"],
    queryFn: () => fetchProjects(),
    enabled: !!user?.id,
    retry: 2,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading)
    return <SideBarProjectSkeleton isSideBarOpen={isSideBarOpen} />;
  if (isError)
    return <ProjectError onRetry={refetch} isSideBarOpen={isSideBarOpen} />;
  if (!data?.projects || data?.projects?.length === 0)
    return <EmptyProjects isSideBarOpen={isSideBarOpen} />;

  return (
    <div className="w-full px-2 sm:px-3 py-4 space-y-2">
      {isSideBarOpen && (
        <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 px-1">
          Recent Projects
        </h2>
      )}

      <div className="space-y-1">
        {data.projects.map((project: Project) => {
          const projectUrl = `/projects/${project.id}`;
          const isActive =
            pathName === projectUrl || pathName.startsWith(projectUrl + "/");

          return (
            <Link
              key={project.id}
              href={projectUrl}
              className={`relative group flex items-center w-full h-10 px-2 sm:px-3 py-2 rounded-lg transition-all duration-200 ease-in-out
                ${
                  isActive
                    ? "bg-primary text-white shadow-lg dark:bg-primary"
                    : "text-zinc-600 hover:bg-primary/10 dark:text-zinc-400 dark:hover:bg-zinc-800/60"
                }`}
              title={project.title}
            >
              {/* Full Title */}
              {isSideBarOpen && (
                <span
                  className={`text-sm font-medium truncate ${
                    isActive ? "text-white" : "text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {project.title}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
