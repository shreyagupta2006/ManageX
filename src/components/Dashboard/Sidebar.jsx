import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  PlusSquare,
  Calendar,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Shield
} from 'lucide-react';

const Sidebar = ({
  role,
  activeTab,
  setActiveTab,
  userName,
  onLogout
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const adminMenu = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'team', name: 'Manage Team', icon: Users },
    { id: 'assign', name: 'Assign Tasks', icon: PlusSquare },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const employeeMenu = [
    { id: 'tasks', name: 'My Tasks', icon: LayoutDashboard },
    { id: 'calendar', name: 'Task Calendar', icon: Calendar },
    { id: 'profile', name: 'My Profile', icon: User },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const menuItems = role === 'admin' ? adminMenu : employeeMenu;

  return (
    <motion.div
      animate={{ width: isCollapsed ? 76 : 260 }}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      className="relative z-40 flex h-screen flex-col border-r border-border bg-sidebar text-sidebar-foreground shrink-0 hidden md:flex"
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-border/50">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shrink-0 font-bold shadow-md">
            {role === 'admin' ? <Shield className="h-4.5 w-4.5" /> : <TrendingUp className="h-4.5 w-4.5" />}
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.02 }}
              className="font-extrabold tracking-tight text-foreground text-base cursor-pointer"
            >
              Manage<span className="text-indigo-500 font-medium">X</span>
            </motion.span>
          )}
        </div>
      </div>

      {/* Collapse Action Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3.5 top-20 z-50 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted shadow-sm transition-colors cursor-pointer"
      >
        {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
      </button>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1.5 px-4 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex w-full items-center gap-3.5 rounded-lg py-2.5 px-3.5 text-sm font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'text-zinc-900 dark:text-zinc-50'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              {/* Sliding Background Active Highlight */}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute inset-0 z-0 rounded-lg bg-zinc-100 dark:bg-zinc-800/80"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              <Icon className={`relative z-10 h-4.5 w-4.5 shrink-0 ${isActive ? 'text-zinc-950 dark:text-zinc-50' : ''}`} />
              
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative z-10 whitespace-nowrap"
                >
                  {item.name}
                </motion.span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Profile Details & Logout */}
      <div className="border-t border-border/50 p-4 space-y-3">
        {!isCollapsed && (
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-border/40">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 font-semibold text-xs shrink-0">
              {userName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-semibold text-foreground leading-tight truncate">
                {userName || 'User'}
              </h4>
              <span className="text-[10px] text-muted-foreground font-medium capitalize">
                {role} account
              </span>
            </div>
          </div>
        )}

        <button
          onClick={onLogout}
          className={`flex w-full items-center gap-3.5 rounded-lg py-2 px-3 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 transition-colors cursor-pointer ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          {!isCollapsed && <span>Log Out</span>}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
