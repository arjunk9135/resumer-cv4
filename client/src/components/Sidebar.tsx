import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  UploadCloud, 
  Users, 
  BarChart, 
  Settings,
  Menu,
  LogOut,
  User
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon, label, href, isActive, onClick }: SidebarItemProps) => {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
        "hover:bg-muted/50",
        isActive ? "bg-muted font-medium text-primary" : "text-muted-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  const navigationLinks = [
    { icon: <LayoutDashboard size={18} />, label: "Dashboard", href: "/" },
    { icon: <UploadCloud size={18} />, label: "Upload Resumes", href: "/upload" },
    { icon: <Users size={18} />, label: "Candidates", href: "/candidates" },
    { icon: <BarChart size={18} />, label: "Analytics", href: "/analytics" },
    { icon: <Settings size={18} />, label: "Settings", href: "/settings" },
  ];

  const sidebarContent = (
    <>
      <div className="flex flex-col justify-between h-full py-4">
        <div className="px-3 py-2">
          <div className="flex items-center mb-6">
            <h2 className="text-xl font-bold">Resume Analyzer</h2>
          </div>
          
          <div className="space-y-1 mt-8">
            {navigationLinks.map((link) => (
              <SidebarItem
                key={link.href}
                icon={link.icon}
                label={link.label}
                href={link.href}
                isActive={location === link.href}
                onClick={closeMobileSidebar}
              />
            ))}
          </div>
        </div>

        <div className="mt-auto px-3">
          <Separator className="my-4" />
          
          {user && (
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user.username}</p>
                  <p className="text-xs text-muted-foreground">Admin</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                <LogOut size={18} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu size={18} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            {sidebarContent}
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 border-r h-screen sticky top-0 overflow-y-auto">
        {sidebarContent}
      </div>
    </>
  );
}