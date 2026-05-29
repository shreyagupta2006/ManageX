import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../../context/AppContext';
import Sidebar from '../dashboard/Sidebar';
import TopNav from '../dashboard/TopNav';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Zap,
  TrendingUp,
  Inbox
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EmployeeDashboard = ({ changeUser, email }) => {
  const {
    currentEmployeeData,
    acceptTask,
    completeTask,
    failTask,
    logoutUser
  } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('tasks');
  
  // Task detail inspection modal state
  const [inspectingTask, setInspectingTask] = useState(null);

  // Fallback for loading states
  if (!currentEmployeeData) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
        <div className="text-center space-y-4">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary inline-block" />
          <p className="text-sm font-medium text-muted-foreground">Syncing workspace records...</p>
        </div>
      </div>
    );
  }

  const { firstName, email: empEmail, tasks, taskCounts } = currentEmployeeData;

  // Logout callback
  const handleLogout = () => {
    logoutUser();
    if (changeUser) changeUser(null);
  };

  // Group tasks for Columns
  const taskGroups = useMemo(() => {
    return {
      new: tasks.filter(t => t.newTask),
      active: tasks.filter(t => t.active),
      completed: tasks.filter(t => t.completed),
      failed: tasks.filter(t => t.failed)
    };
  }, [tasks]);

  // Construct a premium responsive custom Grid Calendar (e.g. showing days of May/June 2026)
  // Let's map calendar days to tasks due on those days.
  const calendarDays = useMemo(() => {
    // Let's generate a standard 31-day month grid for June 2026 (since mock data task Dates are in June 2026)
    const days = [];
    for (let i = 1; i <= 30; i++) {
      const dateStr = `2026-06-${i.toString().padStart(2, '0')}`;
      const dayTasks = tasks.filter(t => t.taskDate === dateStr);
      days.push({ dayNum: i, dateStr, tasks: dayTasks });
    }
    return days;
  }, [tasks]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar Navigation */}
      <Sidebar
        role="employee"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userName={firstName}
        onLogout={handleLogout}
      />

      {/* Main dashboard content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav
          role="employee"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userName={firstName}
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
              {/* TAB 1: WORKSPACE KANBAN BOARD */}
              {activeTab === 'tasks' && (
                <>
                  {/* Title Welcome Header */}
                  <div className="flex flex-col text-left">
                    <h1 className="text-2xl font-bold tracking-tight">Productivity Board</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                      Manage daily queue lists. Double-click any card to inspect descriptions.
                    </p>
                  </div>

                  {/* Circular Performance Progress Ring Section */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card gradient className="p-4 flex items-center justify-between text-left">
                      <div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">New Assigned</span>
                        <h4 className="text-2xl font-extrabold mt-1 text-sky-600 dark:text-sky-400">{taskCounts.newTask}</h4>
                      </div>
                      <div className="h-9 w-9 rounded-full bg-sky-50 dark:bg-sky-950/20 flex items-center justify-center text-sky-500">
                        <Zap className="h-4.5 w-4.5" />
                      </div>
                    </Card>

                    <Card gradient className="p-4 flex items-center justify-between text-left">
                      <div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">In Progress</span>
                        <h4 className="text-2xl font-extrabold mt-1 text-yellow-600 dark:text-yellow-400">{taskCounts.active}</h4>
                      </div>
                      <div className="h-9 w-9 rounded-full bg-yellow-50 dark:bg-yellow-950/20 flex items-center justify-center text-yellow-500">
                        <Clock className="h-4.5 w-4.5" />
                      </div>
                    </Card>

                    <Card gradient className="p-4 flex items-center justify-between text-left">
                      <div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Completed</span>
                        <h4 className="text-2xl font-extrabold mt-1 text-emerald-600 dark:text-emerald-400">{taskCounts.completed}</h4>
                      </div>
                      <div className="h-9 w-9 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-500">
                        <CheckCircle2 className="h-4.5 w-4.5" />
                      </div>
                    </Card>

                    <Card gradient className="p-4 flex items-center justify-between text-left">
                      <div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Failed</span>
                        <h4 className="text-2xl font-extrabold mt-1 text-red-600 dark:text-red-400">{taskCounts.failed}</h4>
                      </div>
                      <div className="h-9 w-9 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center text-red-500">
                        <AlertCircle className="h-4.5 w-4.5" />
                      </div>
                    </Card>
                  </div>

                  {/* Kanban Columns Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* COLUMN 1: NEW ASSIGNMENTS */}
                    <div className="space-y-3.5">
                      <div className="flex justify-between items-center px-1 border-b border-border pb-2.5">
                        <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">To Do / New</span>
                        <Badge variant="newTask">{taskGroups.new.length}</Badge>
                      </div>
                      <div className="space-y-3 min-h-[300px] overflow-y-auto max-h-[50vh] pr-1">
                        {taskGroups.new.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-10 border border-dashed border-border/80 rounded-xl text-muted-foreground text-xs">
                            <Inbox className="h-6 w-6 stroke-[1.25] text-zinc-300 dark:text-zinc-700 mb-1" />
                            <span>No new tasks.</span>
                          </div>
                        ) : (
                          taskGroups.new.map((task, idx) => (
                            <TaskCard
                              key={idx}
                              task={task}
                              onInspect={() => setInspectingTask(task)}
                              actions={
                                <Button
                                  variant="primary"
                                  size="sm"
                                  className="w-full text-[11px] font-semibold tracking-tight py-1.5 h-8 mt-3 cursor-pointer"
                                  onClick={() => acceptTask(empEmail, task.taskTitle)}
                                >
                                  Accept Task
                                </Button>
                              }
                            />
                          ))
                        )}
                      </div>
                    </div>

                    {/* COLUMN 2: ACTIVE / IN PROGRESS */}
                    <div className="space-y-3.5">
                      <div className="flex justify-between items-center px-1 border-b border-border pb-2.5">
                        <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-wider">In Progress</span>
                        <Badge variant="active">{taskGroups.active.length}</Badge>
                      </div>
                      <div className="space-y-3 min-h-[300px] overflow-y-auto max-h-[50vh] pr-1">
                        {taskGroups.active.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-10 border border-dashed border-border/80 rounded-xl text-muted-foreground text-xs">
                            <Inbox className="h-6 w-6 stroke-[1.25] text-zinc-300 dark:text-zinc-700 mb-1" />
                            <span>Queue is empty.</span>
                          </div>
                        ) : (
                          taskGroups.active.map((task, idx) => (
                            <TaskCard
                              key={idx}
                              task={task}
                              onInspect={() => setInspectingTask(task)}
                              actions={
                                <div className="grid grid-cols-2 gap-2 mt-3">
                                  <Button
                                    variant="success"
                                    size="sm"
                                    className="text-[11px] font-semibold py-1.5 h-8 cursor-pointer"
                                    onClick={() => completeTask(empEmail, task.taskTitle)}
                                  >
                                    Done
                                  </Button>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    className="text-[11px] font-semibold py-1.5 h-8 cursor-pointer"
                                    onClick={() => failTask(empEmail, task.taskTitle)}
                                  >
                                    Fail
                                  </Button>
                                </div>
                              }
                            />
                          ))
                        )}
                      </div>
                    </div>

                    {/* COLUMN 3: COMPLETED */}
                    <div className="space-y-3.5">
                      <div className="flex justify-between items-center px-1 border-b border-border pb-2.5">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Completed</span>
                        <Badge variant="completed">{taskGroups.completed.length}</Badge>
                      </div>
                      <div className="space-y-3 min-h-[300px] overflow-y-auto max-h-[50vh] pr-1">
                        {taskGroups.completed.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-10 border border-dashed border-border/80 rounded-xl text-muted-foreground text-xs">
                            <Inbox className="h-6 w-6 stroke-[1.25] text-zinc-300 dark:text-zinc-700 mb-1" />
                            <span>No finished items.</span>
                          </div>
                        ) : (
                          taskGroups.completed.map((task, idx) => (
                            <TaskCard
                              key={idx}
                              task={task}
                              onInspect={() => setInspectingTask(task)}
                              actions={
                                <div className="mt-3">
                                  <Badge variant="completed" className="w-full justify-center h-8 font-bold">✓ Completed</Badge>
                                </div>
                              }
                            />
                          ))
                        )}
                      </div>
                    </div>

                    {/* COLUMN 4: FAILED */}
                    <div className="space-y-3.5">
                      <div className="flex justify-between items-center px-1 border-b border-border pb-2.5">
                        <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">Failed</span>
                        <Badge variant="failed">{taskGroups.failed.length}</Badge>
                      </div>
                      <div className="space-y-3 min-h-[300px] overflow-y-auto max-h-[50vh] pr-1">
                        {taskGroups.failed.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-10 border border-dashed border-border/80 rounded-xl text-muted-foreground text-xs">
                            <Inbox className="h-6 w-6 stroke-[1.25] text-zinc-300 dark:text-zinc-700 mb-1" />
                            <span>Zero failed items.</span>
                          </div>
                        ) : (
                          taskGroups.failed.map((task, idx) => (
                            <TaskCard
                              key={idx}
                              task={task}
                              onInspect={() => setInspectingTask(task)}
                              actions={
                                <div className="mt-3">
                                  <Badge variant="failed" className="w-full justify-center h-8 font-bold">✗ Failed</Badge>
                                </div>
                              }
                            />
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* TAB 2: TASK CALENDAR TIMELINE */}
              {activeTab === 'calendar' && (
                <>
                  {/* Title Welcome Header */}
                  <div className="flex flex-col text-left">
                    <h1 className="text-2xl font-bold tracking-tight">Timeline Calendar</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                      Check your deadline layout in a monthly timeline view.
                    </p>
                  </div>

                  {/* Calendar Month Header banner */}
                  <Card className="p-6 text-left">
                    <div className="flex items-center justify-between border-b border-border/50 pb-4 mb-6">
                      <div>
                        <h2 className="text-lg font-bold">June 2026</h2>
                        <span className="text-xs text-muted-foreground">Standard monthly task planner grid</span>
                      </div>
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                        <CalendarIcon className="h-4.5 w-4.5" />
                      </div>
                    </div>

                    {/* Week Header Days */}
                    <div className="grid grid-cols-7 gap-2.5 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      <div>Mon</div>
                      <div>Tue</div>
                      <div>Wed</div>
                      <div>Thu</div>
                      <div>Fri</div>
                      <div>Sat</div>
                      <div>Sun</div>
                    </div>

                    {/* Calendar Month Days grid */}
                    <div className="grid grid-cols-7 gap-2.5">
                      {/* Empty cells to pad first week (June 1st, 2026 is a Monday, so 0 padding cells needed!) */}
                      {calendarDays.map((day) => (
                        <div
                          key={day.dayNum}
                          className={`min-h-[90px] p-2 rounded-lg border border-border/40 text-left flex flex-col justify-between transition-colors hover:bg-muted/30 select-none ${
                            day.tasks.length > 0
                              ? 'bg-zinc-50/50 dark:bg-zinc-900/10 border-indigo-500/20'
                              : 'bg-card'
                          }`}
                        >
                          <span className={`text-xs font-bold ${day.tasks.length > 0 ? 'text-indigo-600 dark:text-indigo-400 font-extrabold' : 'text-muted-foreground'}`}>
                            {day.dayNum}
                          </span>

                          <div className="space-y-1 mt-2">
                            {day.tasks.map((t, idx) => (
                              <button
                                key={idx}
                                onClick={() => setInspectingTask(t)}
                                className="w-full text-[9px] font-bold py-0.5 px-1.5 rounded truncate text-left cursor-pointer border block capitalize transition-all hover:scale-[1.02] bg-white border-border text-foreground dark:bg-zinc-800"
                                title={t.taskTitle}
                              >
                                {t.taskTitle}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </>
              )}

              {/* TAB 3: PROFILE */}
              {activeTab === 'profile' && (
                <>
                  <div className="flex flex-col text-left">
                    <h1 className="text-2xl font-bold tracking-tight">Work Profile</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                      Explore your productivity analytics, employee department details, and achievements.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
                    {/* Left: Identity Card */}
                    <Card gradient className="p-6 flex flex-col items-center text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-150 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 font-extrabold text-2xl shadow-inner mb-4">
                        {firstName.charAt(0).toUpperCase()}
                      </div>
                      
                      <h2 className="text-xl font-bold">{firstName}</h2>
                      <span className="text-xs text-muted-foreground font-semibold mt-1">{empEmail}</span>

                      <div className="w-full border-t border-border/50 my-5 pt-4 space-y-3.5 text-xs text-left">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground font-medium">Department</span>
                          <span className="font-semibold text-foreground">Engineering</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground font-medium">Clearance Role</span>
                          <Badge variant="secondary">L2 Associate</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground font-medium">Clearance Level</span>
                          <span className="font-semibold text-foreground">Developer Specialist</span>
                        </div>
                      </div>
                    </Card>

                    {/* Middle: Performance SVG Circular ring */}
                    <Card className="lg:col-span-2 p-6 flex flex-col">
                      <h3 className="font-bold text-base mb-1">Performance Indicators</h3>
                      <p className="text-xs text-muted-foreground mb-6">Real-time completion success metrics.</p>

                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center justify-center">
                        {/* Circular ring container */}
                        <div className="flex justify-center relative">
                          <svg className="w-40 h-40 transform -rotate-90">
                            {/* Outer Track Ring */}
                            <circle
                              cx="80"
                              cy="80"
                              r="64"
                              className="stroke-zinc-100 dark:stroke-zinc-800"
                              strokeWidth="10"
                              fill="transparent"
                            />
                            {/* Highlight Progress fill */}
                            <circle
                              cx="80"
                              cy="80"
                              r="64"
                              className="stroke-emerald-500"
                              strokeWidth="10"
                              fill="transparent"
                              strokeDasharray="402"
                              strokeDashoffset={402 - (402 * (tasks.length ? (taskCounts.completed / tasks.length) : 0))}
                              strokeLinecap="round"
                            />
                          </svg>

                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-extrabold tracking-tight">
                              {tasks.length ? Math.round((taskCounts.completed / tasks.length) * 100) : 0}%
                            </span>
                            <span className="text-[10px] text-muted-foreground font-bold uppercase mt-0.5">Success Rate</span>
                          </div>
                        </div>

                        {/* List details */}
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-muted-foreground">Finished Assignments</span>
                              <span>{taskCounts.completed} / {tasks.length}</span>
                            </div>
                            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${tasks.length ? (taskCounts.completed / tasks.length) * 100 : 0}%` }}
                                className="h-full bg-emerald-500 rounded-full"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-muted-foreground">Active Workload</span>
                              <span>{taskCounts.active} Active</span>
                            </div>
                            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${tasks.length ? (taskCounts.active / tasks.length) * 100 : 0}%` }}
                                className="h-full bg-amber-400 rounded-full"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-muted-foreground">Failed Deadlines</span>
                              <span>{taskCounts.failed} Failed</span>
                            </div>
                            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${tasks.length ? (taskCounts.failed / tasks.length) * 100 : 0}%` }}
                                className="h-full bg-red-500 rounded-full"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* DYNAMIC DETAILED TASK INSPECTOR MODAL */}
      <Modal
        isOpen={!!inspectingTask}
        onClose={() => setInspectingTask(null)}
        title={inspectingTask ? inspectingTask.taskTitle : ''}
        size="md"
      >
        {inspectingTask && (
          <div className="space-y-5 text-left text-xs leading-relaxed">
            {/* Meta Tags Row */}
            <div className="flex flex-wrap gap-2.5">
              <Badge variant={inspectingTask.priority}>{inspectingTask.priority} Priority</Badge>
              <Badge variant="secondary" className="capitalize">{inspectingTask.category}</Badge>
              
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-semibold ml-auto">
                <Clock className="h-3.5 w-3.5 text-zinc-400" /> Assigned: {inspectingTask.assignedDate || '2026-05-29'}
              </div>
            </div>

            {/* Description Text */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Description</span>
              <p className="p-3.5 rounded-xl border border-border bg-zinc-50/50 dark:bg-zinc-900/10 text-foreground leading-relaxed text-[13px]">
                {inspectingTask.taskDescription}
              </p>
            </div>

            {/* Due Date Indicator panel */}
            <div className="flex items-center justify-between p-3.5 border border-border bg-card rounded-xl">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-indigo-500 shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground">Task Deadline</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Please deliver on or before the calendar date.</p>
                </div>
              </div>
              <span className="font-bold text-sm text-foreground">{inspectingTask.taskDate}</span>
            </div>

            {/* Action buttons list in inspect drawer */}
            <div className="flex justify-end gap-2.5 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setInspectingTask(null)}>
                Close Panel
              </Button>
              
              {/* Conditional context actions */}
              {inspectingTask.newTask && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    acceptTask(empEmail, inspectingTask.taskTitle);
                    setInspectingTask(null);
                  }}
                >
                  Accept Task
                </Button>
              )}
              
              {inspectingTask.active && (
                <>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      failTask(empEmail, inspectingTask.taskTitle);
                      setInspectingTask(null);
                    }}
                  >
                    Mark Failed
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => {
                      completeTask(empEmail, inspectingTask.taskTitle);
                      setInspectingTask(null);
                    }}
                  >
                    Mark Completed
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// MINI SUB-COMPONENT: TASK CARD (Used within board columns)
const TaskCard = ({ task, actions, onInspect }) => {
  const borderColors = {
    high: 'border-l-4 border-l-red-500',
    medium: 'border-l-4 border-l-amber-500',
    low: 'border-l-4 border-l-blue-500'
  };

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 8px 24px -8px rgba(0,0,0,0.06)' }}
      onDoubleClick={onInspect}
      className={`p-4 rounded-xl border border-border bg-card text-left text-xs shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all cursor-pointer select-none space-y-3.5 hover:border-zinc-300 dark:hover:border-zinc-700 ${borderColors[task.priority] || ''}`}
    >
      {/* Category and priority details */}
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 capitalize bg-sky-50 dark:bg-sky-950/20 px-2 py-0.5 rounded-full">
          {task.category}
        </span>
        <Badge variant={task.priority} className="text-[9px] uppercase">{task.priority}</Badge>
      </div>

      {/* Task Content text */}
      <div className="space-y-1" onClick={onInspect}>
        <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors leading-snug">
          {task.taskTitle}
        </h4>
        <p className="text-muted-foreground leading-normal line-clamp-2">
          {task.taskDescription}
        </p>
      </div>

      {/* Due date and calendar footer */}
      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground border-t border-border/40 pt-3 mt-1 justify-between">
        <span className="flex items-center gap-1">
          <CalendarIcon className="h-3 w-3 shrink-0" /> Due {task.taskDate}
        </span>
        <Button variant="ghost" size="sm" className="h-6 text-[10px] py-0 px-2 text-zinc-400 hover:text-zinc-800" onClick={onInspect}>
          Inspect
        </Button>
      </div>

      {/* Custom Context Action Buttons */}
      {actions && (
        <div className="pt-1.5">
          {actions}
        </div>
      )}
    </motion.div>
  );
};

export default EmployeeDashboard;