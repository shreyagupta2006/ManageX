import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import {
  Sun,
  Moon,
  Bell,
  Menu,
  X,
  Search,
  LayoutDashboard,
  Users,
  PlusSquare,
  Calendar,
  User,
  Settings,
  LogOut,
  Shield,
  TrendingUp,
  Inbox
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TopNav = ({
  role,
  activeTab,
  setActiveTab,
  userName,
  onLogout
}) => {
  const { theme, toggleTheme, userData } = useContext(AppContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Derive notifications from tasks: let's show tasks that are 'newTask'
  const newTasks = userData?.flatMap(emp => 
    (emp.tasks || [])
      .filter(t => t.newTask)
      .map(t => ({ ...t, empName: emp.firstName }))
  ) || [];

  const tabNames = {
    overview: 'Overview',
    team: 'Team Directory',
    assign: 'Assign Tasks',
    tasks: 'My Workspace',
    calendar: 'Schedule Calendar',
    profile: 'User Profile',
    settings: 'Settings Control'
  };

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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
      {/* Left: Breadcrumbs / Mobile trigger */}
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground md:hidden transition-colors cursor-pointer"
        >
          <Menu className="h-4.5 w-4.5" />
        </button>

        {/* Breadcrumb Display */}
        <div className="hidden sm:flex items-center gap-2 text-sm font-medium">
          <span className="text-muted-foreground capitalize">{role}</span>
          <span className="text-zinc-300 dark:text-zinc-700">/</span>
          <span className="text-foreground font-semibold">{tabNames[activeTab] || 'Dashboard'}</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-indigo-500" />}
        </button>

        {/* Notifications Center */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <Bell className="h-4.5 w-4.5" />
            {newTasks.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-background animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown Drawer */}
          <AnimatePresence>
            {isNotificationsOpen && (
              <>
                {/* Backdrop Click Dismiss */}
                <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 z-50 w-80 rounded-xl border border-border bg-card text-card-foreground shadow-xl p-4 overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-border/50 pb-2.5 mb-3">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                    <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-semibold px-2 py-0.5 rounded-full">
                      {newTasks.length} New
                    </span>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {newTasks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
                        <Inbox className="h-8 w-8 stroke-[1.25] text-zinc-300 dark:text-zinc-700 mb-1.5" />
                        <p className="text-xs">All caught up! No alerts.</p>
                      </div>
                    ) : (
                      newTasks.map((t, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col gap-1 p-2 rounded-lg border border-border/40 hover:bg-muted/50 transition-colors text-left"
                        >
                          <div className="flex justify-between items-start gap-1">
                            <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 capitalize">
                              {t.category}
                            </span>
                            <span className="text-[9px] text-muted-foreground">
                              {t.assignedDate}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-foreground truncate">
                            {t.taskTitle}
                          </p>
                          <p className="text-[10px] text-muted-foreground leading-normal">
                            Assigned to <span className="font-semibold">{t.empName}</span>
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Small avatar separator */}
        <div className="h-6 w-px bg-border" />

        {/* User Info Capsule */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 font-bold text-xs select-none">
            {userName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span className="text-xs font-semibold text-foreground hidden sm:inline">
            {userName}
          </span>
        </div>
      </div>

      {/* MOBILE COLLAPSIBLE DRAWER SIDEBAR */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            {/* Dark blur background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Sidebar drawer card */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="relative z-10 flex w-72 h-full flex-col bg-sidebar text-sidebar-foreground border-r border-border p-6 shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Brand Header */}
              <div className="flex items-center gap-2 mb-8 mt-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold shrink-0">
                  {role === 'admin' ? <Shield className="h-4.5 w-4.5" /> : <TrendingUp className="h-4.5 w-4.5" />}
                </div>
                <span className="font-extrabold tracking-tight text-foreground text-base">
                  Manage<span className="text-indigo-500 font-medium">X</span>
                </span>
              </div>

              {/* Navigation */}
              <nav className="flex-1 space-y-1.5">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`relative flex w-full items-center gap-3.5 rounded-lg py-2.5 px-3.5 text-sm font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'text-zinc-900 dark:text-zinc-50'
                          : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicatorMobile"
                          className="absolute inset-0 z-0 rounded-lg bg-zinc-100 dark:bg-zinc-800/80"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <Icon className={`relative z-10 h-4.5 w-4.5 shrink-0 ${isActive ? 'text-zinc-950 dark:text-zinc-50' : ''}`} />
                      <span className="relative z-10">{item.name}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="border-t border-border/50 pt-4 mt-auto">
                <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-border/40 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 font-semibold text-xs shrink-0">
                    {userName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="overflow-hidden text-left">
                    <h4 className="text-xs font-semibold text-foreground leading-tight truncate">
                      {userName || 'User'}
                    </h4>
                    <span className="text-[10px] text-muted-foreground font-medium capitalize">
                      {role} account
                    </span>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="flex w-full items-center justify-start gap-3.5 rounded-lg py-2 px-3.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4.5 w-4.5 shrink-0" />
                  <span>Log Out</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default TopNav;
