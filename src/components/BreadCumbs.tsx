// components/ui/Breadcrumbs.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Breadcrumbs = () => {
  const pathname = usePathname();
  const router = useRouter();

  const pathParts = pathname.split("/").filter(Boolean); // remove empty string
  const breadcrumbs = pathParts.map((part, index) => {
    const href = "/" + pathParts.slice(0, index + 1).join("/");
    const isLast = index === pathParts.length - 1;
    return {
      name: decodeURIComponent(part),
      href,
      isLast,
    };
  });

  return (
    <div className="flex items-center gap-2 mb-4 px-4 py-2 bg-background border-b">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm"
      >
        <ArrowLeft size={16} />
        Back
      </Button>

      <Breadcrumb>
        <BreadcrumbList className="text-muted-foreground">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/" className="capitalize">
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {breadcrumbs.map((crumb, i) => (
            <div key={i} className="flex items-center">
              <BreadcrumbSeparator>
                <ChevronRight size={14} />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink
                  asChild
                  className={
                    crumb.isLast ? "text-foreground font-semibold" : ""
                  }
                >
                  <Link href={crumb.href} className="capitalize">
                    {crumb.name.replace(/-/g, " ")}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};
