import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../../context/AppContext';
import Sidebar from '../dashboard/Sidebar';
import TopNav from '../dashboard/TopNav';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import {
  Users,
  Briefcase,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Plus,
  Eye,
  Calendar,
  AlertTriangle,
  FolderDot
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = ({ changeUser }) => {
  const { userData, assignTask, globalStats, logoutUser } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortField, setSortField] = useState('firstName');
  const [sortDirection, setSortDirection] = useState('asc');

  // Employee detail side-drawer state
  const [selectedEmp, setSelectedEmp] = useState(null);

  // Task assignment form state
  const [assigneeId, setAssigneeId] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [taskCategory, setTaskCategory] = useState('');
  const [taskPriority, setTaskPriority] = useState('medium');

  // Handle task submission
  const handleAssignTask = (e) => {
    e.preventDefault();
    if (!assigneeId || !taskTitle || !taskDesc || !taskDate || !taskCategory) return;
    
    assignTask(assigneeId, taskTitle, taskDesc, taskDate, taskCategory, taskPriority);
    
    // Clear form
    setAssigneeId('');
    setTaskTitle('');
    setTaskDesc('');
    setTaskDate('');
    setTaskCategory('');
    setTaskPriority('medium');
    
    // Redirect to Overview to see updates
    setActiveTab('overview');
  };

  // Logout callback
  const handleLogout = () => {
    logoutUser();
    if (changeUser) changeUser(null);
  };

  // Sorting and Filtering logic
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredEmployees = useMemo(() => {
    return userData
      .filter((emp) => {
        const matchesSearch = emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory = categoryFilter === 'all' || emp.tasks.some(t => t.category.toLowerCase() === categoryFilter.toLowerCase());
        
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        let valA, valB;
        if (sortField === 'firstName') {
          valA = a.firstName;
          valB = b.firstName;
        } else if (sortField === 'completed') {
          valA = a.taskCounts.completed;
          valB = b.taskCounts.completed;
        } else if (sortField === 'active') {
          valA = a.taskCounts.active;
          valB = b.taskCounts.active;
        } else if (sortField === 'total') {
          valA = a.tasks.length;
          valB = b.tasks.length;
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [userData, searchQuery, categoryFilter, sortField, sortDirection]);

  // Derive unique categories for filter dropdown
  const uniqueCategories = useMemo(() => {
    const cats = new Set();
    userData.forEach(emp => {
      emp.tasks.forEach(t => {
        if (t.category) cats.add(t.category);
      });
    });
    return Array.from(cats);
  }, [userData]);

  // Derive a live "Recent Activity Feed" based on task list configurations
  const recentActivities = useMemo(() => {
    const logs = [];
    userData.forEach(emp => {
      emp.tasks.forEach(t => {
        if (t.newTask) {
          logs.push({
            type: 'assigned',
            text: `Assigned "${t.taskTitle}" to ${emp.firstName}`,
            time: t.assignedDate || 'Just now',
            priority: t.priority
          });
        } else if (t.completed) {
          logs.push({
            type: 'completed',
            text: `${emp.firstName} completed "${t.taskTitle}"`,
            time: t.taskDate,
            priority: t.priority
          });
        } else if (t.failed) {
          logs.push({
            type: 'failed',
            text: `${emp.firstName} failed "${t.taskTitle}"`,
            time: t.taskDate,
            priority: t.priority
          });
        }
      });
    });
    // Return latest 6 activities
    return logs.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 6);
  }, [userData]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar navigation */}
      <Sidebar
        role="admin"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userName="Admin Command"
        onLogout={handleLogout}
      />

      {/* Main dashboard content container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav
          role="admin"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userName="Admin"
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <>
                  {/* Dashboard Welcome header */}
                  <div className="flex flex-col text-left">
                    <h1 className="text-2xl font-bold tracking-tight">Company Pulse</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                      Monitor organization productivity, active assignees, and task metrics.
                    </p>
                  </div>

                  {/* KPI Grid Panel */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card hoverEffect gradient className="p-5 flex flex-col text-left relative overflow-hidden group">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Active Staff
                        </span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                          <Users className="h-4.5 w-4.5" />
                        </div>
                      </div>
                      <h3 className="text-3xl font-extrabold mt-3 tracking-tight">{userData.length}</h3>
                      <p className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-0.5">
                        100% capacity assigned
                      </p>
                    </Card>

                    <Card hoverEffect gradient className="p-5 flex flex-col text-left relative overflow-hidden group">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Active Tasks
                        </span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-50 dark:bg-yellow-950/20 text-yellow-600 dark:text-yellow-400">
                          <Clock className="h-4.5 w-4.5" />
                        </div>
                      </div>
                      <h3 className="text-3xl font-extrabold mt-3 tracking-tight">{globalStats.totalActive}</h3>
                      <p className="text-[10px] text-zinc-500 font-medium mt-1">
                        Currently in progress
                      </p>
                    </Card>

                    <Card hoverEffect gradient className="p-5 flex flex-col text-left relative overflow-hidden group">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Completed Tasks
                        </span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-4.5 w-4.5" />
                        </div>
                      </div>
                      <h3 className="text-3xl font-extrabold mt-3 tracking-tight">{globalStats.totalCompleted}</h3>
                      <p className="text-[10px] text-emerald-600 font-semibold mt-1">
                        Completion rate: {globalStats.totalTasks ? Math.round((globalStats.totalCompleted / globalStats.totalTasks) * 100) : 0}%
                      </p>
                    </Card>

                    <Card hoverEffect gradient className="p-5 flex flex-col text-left relative overflow-hidden group">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Unassigned / New
                        </span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400">
                          <Briefcase className="h-4.5 w-4.5" />
                        </div>
                      </div>
                      <h3 className="text-3xl font-extrabold mt-3 tracking-tight">{globalStats.totalNew}</h3>
                      <p className="text-[10px] text-zinc-500 font-medium mt-1">
                        Pending employee acceptance
                      </p>
                    </Card>
                  </div>

                  {/* SVG Charts and Recent Activity Feed Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* SVG Chart Card */}
                    <Card className="lg:col-span-2 p-6 flex flex-col text-left">
                      <div className="mb-4">
                        <h3 className="font-bold text-base">Assignee Progress Analytics</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Visual breakdown of active, completed, and failed tasks by employee.
                        </p>
                      </div>

                      {/* Customized SVG Chart */}
                      <div className="relative flex-1 flex items-end justify-between gap-6 h-64 pt-6 pb-2 border-b border-border">
                        {userData.map((emp, index) => {
                          const total = emp.tasks.length || 1;
                          const compPct = (emp.taskCounts.completed / total) * 100;
                          const activePct = (emp.taskCounts.active / total) * 100;
                          const failPct = (emp.taskCounts.failed / total) * 100;

                          return (
                            <div key={emp.id} className="flex-1 flex flex-col items-center group h-full justify-end">
                              {/* Stacked bar diagram */}
                              <div className="relative w-7 sm:w-10 rounded-t-md overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex flex-col justify-end h-full shadow-inner transition-transform group-hover:scale-105">
                                {/* Completed segment */}
                                <div
                                  style={{ height: `${compPct}%` }}
                                  className="w-full bg-emerald-500/80 dark:bg-emerald-500/70"
                                  title={`Completed: ${emp.taskCounts.completed}`}
                                />
                                {/* Active segment */}
                                <div
                                  style={{ height: `${activePct}%` }}
                                  className="w-full bg-amber-400/80 dark:bg-amber-400/70"
                                  title={`Active: ${emp.taskCounts.active}`}
                                />
                                {/* Failed segment */}
                                <div
                                  style={{ height: `${failPct}%` }}
                                  className="w-full bg-red-500/80 dark:bg-red-500/70"
                                  title={`Failed: ${emp.taskCounts.failed}`}
                                />
                              </div>
                              <span className="text-[10px] font-bold mt-2 truncate max-w-full">
                                {emp.firstName}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Chart Legend */}
                      <div className="flex gap-4 mt-4 justify-center text-xs font-semibold">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                          <span className="text-muted-foreground">Completed</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                          <span className="text-muted-foreground">In Progress</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                          <span className="text-muted-foreground">Failed</span>
                        </div>
                      </div>
                    </Card>

                    {/* Activity Feed */}
                    <Card className="p-6 flex flex-col text-left">
                      <div className="mb-4">
                        <h3 className="font-bold text-base">Live Activity Feed</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Real-time task transition log updates.
                        </p>
                      </div>

                      <div className="flex-1 space-y-3.5 overflow-y-auto max-h-64 pr-1">
                        {recentActivities.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground text-xs text-center">
                            <FolderDot className="h-8 w-8 stroke-[1.25] text-zinc-300 dark:text-zinc-700 mb-1.5" />
                            <span>No recent events to log.</span>
                          </div>
                        ) : (
                          recentActivities.map((log, idx) => (
                            <div key={idx} className="flex gap-3 items-start text-xs border-b border-border/30 pb-3 last:border-0 last:pb-0">
                              <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                                log.type === 'completed'
                                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                                  : log.type === 'failed'
                                  ? 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400'
                                  : 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400'
                              }`}>
                                {log.type === 'completed' ? '✓' : log.type === 'failed' ? '✗' : '+'}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-foreground leading-normal">{log.text}</p>
                                <span className="text-[10px] text-muted-foreground mt-0.5 block">{log.time}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </Card>
                  </div>
                </>
              )}

              {/* TAB 2: MANAGE TEAM */}
              {activeTab === 'team' && (
                <>
                  {/* Header Title */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-left gap-4">
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight">Team Directory</h1>
                      <p className="text-sm text-muted-foreground mt-1">
                        Search and filter assignees. Double-click or inspect to view details.
                      </p>
                    </div>

                    <Button variant="primary" size="sm" onClick={() => setActiveTab('assign')}>
                      <Plus className="h-4 w-4" /> Assign New Task
                    </Button>
                  </div>

                  {/* Filtering / Search Controls bar */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search Field */}
                    <div className="relative flex-1 flex items-center">
                      <Search className="absolute left-3 h-4 w-4 text-zinc-400" />
                      <input
                        type="text"
                        placeholder="Search employees by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 rounded-lg border border-border bg-card pl-9 pr-4 text-sm text-foreground outline-none transition-all focus:border-ring"
                      />
                    </div>

                    {/* Category Filter selector */}
                    <div className="relative flex items-center">
                      <SlidersHorizontal className="absolute left-3 h-4 w-4 text-zinc-400" />
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="h-10 rounded-lg border border-border bg-card pl-9 pr-8 text-sm text-foreground outline-none transition-all focus:border-ring cursor-pointer appearance-none min-w-[140px]"
                      >
                        <option value="all">All Tags</option>
                        {uniqueCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Stripe-like Directory Table */}
                  <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-border bg-muted/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            <th className="px-6 py-4 cursor-pointer select-none" onClick={() => handleSort('firstName')}>
                              <div className="flex items-center gap-1.5">
                                Employee Name
                                {sortField === 'firstName' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                              </div>
                            </th>
                            <th className="px-6 py-4 cursor-pointer select-none" onClick={() => handleSort('active')}>
                              <div className="flex items-center gap-1.5">
                                In Progress
                                {sortField === 'active' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                              </div>
                            </th>
                            <th className="px-6 py-4 cursor-pointer select-none" onClick={() => handleSort('completed')}>
                              <div className="flex items-center gap-1.5">
                                Completed
                                {sortField === 'completed' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                              </div>
                            </th>
                            <th className="px-6 py-4 cursor-pointer select-none" onClick={() => handleSort('total')}>
                              <div className="flex items-center gap-1.5">
                                Total Tasks
                                {sortField === 'total' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                              </div>
                            </th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60 text-sm">
                          {filteredEmployees.length === 0 ? (
                            <tr>
                              <td colSpan="5" className="px-6 py-12 text-center text-muted-foreground text-xs">
                                No matching employees found.
                              </td>
                            </tr>
                          ) : (
                            filteredEmployees.map((emp) => (
                              <tr
                                key={emp.id}
                                onDoubleClick={() => setSelectedEmp(emp)}
                                className="hover:bg-muted/40 transition-colors group cursor-pointer"
                              >
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 font-semibold text-sm">
                                      {emp.firstName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-foreground leading-normal">{emp.firstName}</h4>
                                      <p className="text-xs text-muted-foreground mt-0.5">{emp.email}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <Badge variant="active">{emp.taskCounts.active} Active</Badge>
                                </td>
                                <td className="px-6 py-4">
                                  <Badge variant="completed">{emp.taskCounts.completed} Completed</Badge>
                                </td>
                                <td className="px-6 py-4 font-semibold text-zinc-700 dark:text-zinc-300">
                                  {emp.tasks.length}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedEmp(emp)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Eye className="h-3.5 w-3.5" /> Inspect
                                  </Button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </>
              )}

              {/* TAB 3: ASSIGN TASKS */}
              {activeTab === 'assign' && (
                <>
                  <div className="flex flex-col text-left max-w-xl mx-auto">
                    <h1 className="text-2xl font-bold tracking-tight">Assign Task Workspace</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                      Distribute tasks to dynamic roles. All changes propagate reactively.
                    </p>
                  </div>

                  <Card className="max-w-xl mx-auto p-6 md:p-8 text-left">
                    <form onSubmit={handleAssignTask} className="space-y-4">
                      {/* Employee Dropdown Selection */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                          Assign To
                        </label>
                        <select
                          required
                          value={assigneeId}
                          onChange={(e) => setAssigneeId(e.target.value)}
                          className="w-full h-11 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none transition-all focus:border-ring cursor-pointer"
                        >
                          <option value="">Choose Employee...</option>
                          {userData.map(emp => (
                            <option key={emp.id} value={emp.id}>
                              {emp.firstName} ({emp.email})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Task Title */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                          Task Title
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Redesign homepage dashboard"
                          value={taskTitle}
                          onChange={(e) => setTaskTitle(e.target.value)}
                          className="w-full h-11 rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none transition-all placeholder:text-zinc-400/80 focus:border-ring"
                        />
                      </div>

                      {/* Due Date & Category Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                            Due Date
                          </label>
                          <input
                            type="date"
                            required
                            value={taskDate}
                            onChange={(e) => setTaskDate(e.target.value)}
                            className="w-full h-11 rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none transition-all focus:border-ring cursor-pointer"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                            Category Tag
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Design / DevOps"
                            value={taskCategory}
                            onChange={(e) => setTaskCategory(e.target.value)}
                            className="w-full h-11 rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none transition-all focus:border-ring"
                          />
                        </div>
                      </div>

                      {/* Task Priority Selector */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                          Task Priority
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {['low', 'medium', 'high'].map(p => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setTaskPriority(p)}
                              className={`h-10 rounded-lg border text-xs font-semibold capitalize transition-all cursor-pointer ${
                                taskPriority === p
                                  ? 'bg-zinc-950 border-zinc-950 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-950 shadow-sm'
                                  : 'bg-card border-border hover:bg-muted text-muted-foreground'
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Description */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                          Detailed Description
                        </label>
                        <textarea
                          required
                          rows="4"
                          placeholder="Provide descriptive criteria and specific links..."
                          value={taskDesc}
                          onChange={(e) => setTaskDesc(e.target.value)}
                          className="w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-zinc-400/80 focus:border-ring"
                        />
                      </div>

                      {/* Submit */}
                      <Button type="submit" variant="primary" className="w-full h-11 text-sm font-semibold cursor-pointer">
                        Assign Assignment
                      </Button>
                    </form>
                  </Card>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* DETAILED TEAM MEMBER DRAWER/MODAL */}
      <Modal
        isOpen={!!selectedEmp}
        onClose={() => setSelectedEmp(null)}
        title={selectedEmp ? `${selectedEmp.firstName}'s Task Workspace` : ''}
        size="lg"
      >
        {selectedEmp && (
          <div className="space-y-5 text-left">
            {/* KPI statistics summary row */}
            <div className="grid grid-cols-4 gap-3 bg-zinc-50 dark:bg-zinc-900/40 border border-border/40 p-4 rounded-xl">
              <div className="text-center">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">New</span>
                <p className="text-lg font-bold mt-0.5 text-sky-600 dark:text-sky-400">{selectedEmp.taskCounts.newTask}</p>
              </div>
              <div className="text-center border-l border-border/40">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">Active</span>
                <p className="text-lg font-bold mt-0.5 text-yellow-600 dark:text-yellow-400">{selectedEmp.taskCounts.active}</p>
              </div>
              <div className="text-center border-l border-border/40">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">Done</span>
                <p className="text-lg font-bold mt-0.5 text-emerald-600 dark:text-emerald-400">{selectedEmp.taskCounts.completed}</p>
              </div>
              <div className="text-center border-l border-border/40">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">Failed</span>
                <p className="text-lg font-bold mt-0.5 text-red-600 dark:text-red-400">{selectedEmp.taskCounts.failed}</p>
              </div>
            </div>

            {/* Complete list of individual employee assignments */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold">Assigned History ({selectedEmp.tasks.length})</h3>
              
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {selectedEmp.tasks.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-6">No tasks assigned to this employee yet.</p>
                ) : (
                  selectedEmp.tasks.map((task, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-border bg-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                    >
                      <div className="space-y-1 max-w-md">
                        <div className="flex flex-wrap gap-2 items-center">
                          <Badge variant={task.priority}>{task.priority} Priority</Badge>
                          <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 capitalize">{task.category}</span>
                        </div>
                        <h4 className="font-bold text-sm text-foreground mt-1">{task.taskTitle}</h4>
                        <p className="text-muted-foreground leading-relaxed">{task.taskDescription}</p>
                      </div>
                      
                      <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center shrink-0 gap-2 border-t sm:border-0 pt-2 sm:pt-0 border-border/50">
                        {/* Status chip */}
                        {task.completed && <Badge variant="completed">Completed</Badge>}
                        {task.failed && <Badge variant="failed">Failed</Badge>}
                        {task.active && <Badge variant="active">Active</Badge>}
                        {task.newTask && <Badge variant="newTask">Pending</Badge>}
                        
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Calendar className="h-3 w-3" /> Due {task.taskDate}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Footer action button */}
            <div className="flex justify-end pt-2">
              <Button variant="secondary" size="sm" onClick={() => setSelectedEmp(null)}>
                Close Panel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
