
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { 
  Home,
  Users,
  UserPlus,
  Database,
  CalendarDays,
  DollarSign,
  BarChart2,
  LogOut,
  Settings,
  AlertTriangle,
  Car,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function AppSidebar() {
  const { user, logout, isAdmin } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // Menu items configuration
  const menuItems = [
    {
      title: 'Dashboard',
      icon: Home,
      path: '/',
      adminOnly: false,
    },
    {
      title: 'Usuários',
      icon: Users,
      path: '/users',
      adminOnly: true,
    },
    {
      title: 'Clientes',
      icon: UserPlus,
      path: '/clients',
      adminOnly: false,
    },
    {
      title: 'Motos',
      icon: Car,
      path: '/motorcycles',
      adminOnly: false,
    },
    {
      title: 'Locações',
      icon: CalendarDays,
      path: '/rentals',
      adminOnly: false,
    },
    {
      title: 'Pagamentos',
      icon: DollarSign,
      path: '/payments',
      adminOnly: false,
    },
    {
      title: 'Contratos',
      icon: FileText,
      path: '/contracts',
      adminOnly: false,
    },
    {
      title: 'Relatórios',
      icon: BarChart2,
      path: '/reports',
      adminOnly: true,
    },
    {
      title: 'Configurações',
      icon: Settings,
      path: '/settings',
      adminOnly: true,
    },
  ];

  const { userRole } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-sidebar-foreground mr-2">
              {collapsed ? "ML" : "MotoLocadora"}
            </span>
          </div>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {menuItems
            .filter(item => !item.adminOnly || isAdmin)
            .map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => 
                      `sidebar-link flex items-center px-4 py-3 my-0.5 rounded-md transition-colors hover:bg-sidebar-accent ${
                        isActive ? "active" : ""
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5 mr-2" />
                    <span className="text-base">{item.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="px-3 py-3 border-t border-sidebar-border">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 px-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                {user?.name.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium truncate">{user?.name}</span>
                <span className="text-xs text-muted-foreground truncate">{user?.role}</span>
              </div>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={logout}
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {!collapsed && "Sair"}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
