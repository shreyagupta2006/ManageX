import React, { createContext, useState, useEffect } from 'react';
import { getLocalStorage, initializeLocalStorage } from '../utils/localStorage';

export const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
    const [userData, setUserData] = useState([]);
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState(null);
    const [theme, setTheme] = useState('light');
    const [toasts, setToasts] = useState([]);

    // 1. Initial Load & Theme Sync
    useEffect(() => {
        // Initialize localStorage safely
        initializeLocalStorage();
        const { employees } = getLocalStorage();
        setUserData(employees);

        // Load theme from localStorage
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            setTheme(storedTheme);
            if (storedTheme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const initialTheme = prefersDark ? 'dark' : 'light';
            setTheme(initialTheme);
            if (initialTheme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }

        // Load Session
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            const parsed = JSON.parse(loggedInUser);
            setUser(parsed.role);
            setEmail(parsed.email);
        }
    }, []);

    // 2. Toast alert functions
    const addToast = (message, type = 'success') => {
        const id = Date.now() + Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 4000);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    // 3. Theme Toggle Function
    const toggleTheme = () => {
        const nextTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(nextTheme);
        localStorage.setItem('theme', nextTheme);
        if (nextTheme === 'dark') {
            document.documentElement.classList.add('dark');
            addToast('Switched to Dark Mode', 'info');
        } else {
            document.documentElement.classList.remove('dark');
            addToast('Switched to Light Mode', 'info');
        }
    };

    // 4. Auth Handlers
    const loginUser = (loginEmail, password) => {
        // Fetch fresh employee and admin records
        const { employees, admin } = getLocalStorage();
        const emailLower = loginEmail.toLowerCase();
        
        // 1. Admin Validation (Permissive Bypass)
        if (emailLower.includes('admin') || loginEmail === 'admin@me.com') {
            setUser('admin');
            setEmail(loginEmail);
            localStorage.setItem('loggedInUser', JSON.stringify({ role: 'admin', email: loginEmail }));
            addToast('Logged in as Administrator', 'success');
            return true;
        }

        // 2. Employee Validation (Permissive Bypass)
        // Check if an employee exists with this exact email
        let foundEmp = employees.find(e => e.email.toLowerCase() === emailLower);
        
        // Fallback to the first employee (Arjun) if the typed email is not in the seeded list
        if (!foundEmp && employees.length > 0) {
            foundEmp = employees[0];
        }

        if (foundEmp) {
            setUser('employee');
            // Log in under the matched employee's seeded email to preserve dynamic tasks
            setEmail(foundEmp.email);
            localStorage.setItem('loggedInUser', JSON.stringify({ role: 'employee', email: foundEmp.email }));
            addToast(`Logged in as ${foundEmp.firstName}`, 'success');
            return true;
        }

        addToast('Invalid Credentials. Please check details.', 'danger');
        return false;
    };

    const logoutUser = () => {
        localStorage.removeItem('loggedInUser');
        setUser(null);
        setEmail(null);
        addToast('Successfully logged out.', 'info');
    };

    // Helper to persist updated user array
    const persistUserData = (updatedData) => {
        setUserData(updatedData);
        localStorage.setItem('employees', JSON.stringify(updatedData));
    };

    // 5. Dynamic Task Workflows
    const assignTask = (employeeId, taskTitle, taskDescription, taskDate, category, priority) => {
        const empId = Number(employeeId);
        const newTask = {
            taskTitle,
            taskDescription,
            taskDate,
            category,
            priority: priority || 'medium',
            assignedDate: new Date().toISOString().split('T')[0],
            active: false,
            newTask: true,
            completed: false,
            failed: false
        };

        const updatedData = userData.map((emp) => {
            if (emp.id === empId) {
                return {
                    ...emp,
                    tasks: [newTask, ...emp.tasks],
                    taskCounts: {
                        ...emp.taskCounts,
                        newTask: emp.taskCounts.newTask + 1
                    }
                };
            }
            return emp;
        });

        persistUserData(updatedData);
        const employeeName = userData.find(e => e.id === empId)?.firstName || 'Employee';
        addToast(`Assigned "${taskTitle}" to ${employeeName}`, 'success');
    };

    const acceptTask = (employeeEmail, taskTitle) => {
        const updatedData = userData.map((emp) => {
            if (emp.email === employeeEmail) {
                const updatedTasks = emp.tasks.map((task) => {
                    if (task.taskTitle === taskTitle && task.newTask) {
                        return {
                            ...task,
                            newTask: false,
                            active: true
                        };
                    }
                    return task;
                });

                return {
                    ...emp,
                    tasks: updatedTasks,
                    taskCounts: {
                        ...emp.taskCounts,
                        newTask: Math.max(0, emp.taskCounts.newTask - 1),
                        active: emp.taskCounts.active + 1
                    }
                };
            }
            return emp;
        });

        persistUserData(updatedData);
        addToast(`Accepted task: "${taskTitle}"`, 'info');
    };

    const completeTask = (employeeEmail, taskTitle) => {
        const updatedData = userData.map((emp) => {
            if (emp.email === employeeEmail) {
                const updatedTasks = emp.tasks.map((task) => {
                    if (task.taskTitle === taskTitle && task.active) {
                        return {
                            ...task,
                            active: false,
                            completed: true
                        };
                    }
                    return task;
                });

                return {
                    ...emp,
                    tasks: updatedTasks,
                    taskCounts: {
                        ...emp.taskCounts,
                        active: Math.max(0, emp.taskCounts.active - 1),
                        completed: emp.taskCounts.completed + 1
                    }
                };
            }
            return emp;
        });

        persistUserData(updatedData);
        addToast(`Completed task: "${taskTitle}"!`, 'success');
    };

    const failTask = (employeeEmail, taskTitle) => {
        const updatedData = userData.map((emp) => {
            if (emp.email === employeeEmail) {
                const updatedTasks = emp.tasks.map((task) => {
                    if (task.taskTitle === taskTitle && task.active) {
                        return {
                            ...task,
                            active: false,
                            failed: true
                        };
                    }
                    return task;
                });

                return {
                    ...emp,
                    tasks: updatedTasks,
                    taskCounts: {
                        ...emp.taskCounts,
                        active: Math.max(0, emp.taskCounts.active - 1),
                        failed: emp.taskCounts.failed + 1
                    }
                };
            }
            return emp;
        });

        persistUserData(updatedData);
        addToast(`Marked task failed: "${taskTitle}"`, 'danger');
    };

    // Compute simple global numbers for admin analytics
    const getGlobalStats = () => {
        return userData.reduce((acc, curr) => {
            acc.totalNew += curr.taskCounts.newTask || 0;
            acc.totalActive += curr.taskCounts.active || 0;
            acc.totalCompleted += curr.taskCounts.completed || 0;
            acc.totalFailed += curr.taskCounts.failed || 0;
            acc.totalTasks += curr.tasks?.length || 0;
            return acc;
        }, { totalNew: 0, totalActive: 0, totalCompleted: 0, totalFailed: 0, totalTasks: 0 });
    };

    const currentEmployeeData = userData.find(emp => emp.email === email);

    return (
        <AppContext.Provider value={{
            userData,
            user,
            email,
            theme,
            toasts,
            currentEmployeeData,
            globalStats: getGlobalStats(),
            loginUser,
            logoutUser,
            toggleTheme,
            addToast,
            removeToast,
            assignTask,
            acceptTask,
            completeTask,
            failTask
        }}>
            {children}
        </AppContext.Provider>
    );
};
