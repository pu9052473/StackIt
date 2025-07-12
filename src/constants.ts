import {
  Lightbulb,
  Brain,
  FolderKanban,
  Users,
  Settings,
  User,
  Activity,
  BarChart3,
} from "lucide-react";

export const Menuitems = {
  ADMIN: [
    { title: "Validate Ideas", url: "/admin/validator", icon: Lightbulb },
    { title: "Brainstorm", url: "/admin/brainstorm", icon: Brain },
    { title: "Projects", url: "/admin/projects", icon: FolderKanban },
    { title: "Users", url: "/admin/users", icon: Users },
    { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
    { title: "Activity Log", url: "/admin/activity-log", icon: Activity },
    { title: "dashboard", url: "/dashboard", icon: User },
    { title: "Settings", url: "/admin/settings", icon: Settings },
  ],
  USER: [
    // { title: "Dashboard", url: "/dashboard", icon: User },
    { title: "Projects", url: "/projects", icon: FolderKanban },
    { title: "Brainstorm", url: "/brainstorm", icon: Brain },
    { title: "Settings", url: "/settings", icon: Settings },
  ],
};