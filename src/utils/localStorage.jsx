// Seeding initial data for the SaaS Employee Management system.
// We preserve all existing keys and format to maintain absolute backward compatibility
// while adding premium metadata fields like 'priority' for richer SaaS functionality.

const initialEmployees = [
    {
        "id": 1,
        "firstName": "Arjun",
        "email": "e@e.com",
        "password": "123",
        "taskCounts": {
            "active": 2,
            "newTask": 1,
            "completed": 1,
            "failed": 0
        },
        "tasks": [
            {
                "active": true,
                "newTask": true,
                "completed": false,
                "failed": false,
                "taskTitle": "Update website homepage",
                "taskDescription": "Revamp the landing page layout to support glassmorphism components and improved dark mode toggles.",
                "taskDate": "2026-06-05",
                "category": "Design",
                "priority": "high",
                "assignedDate": "2026-05-29"
            },
            {
                "active": false,
                "newTask": false,
                "completed": true,
                "failed": false,
                "taskTitle": "Client onboarding sync",
                "taskDescription": "Discuss final workflow integration requirements and deliver technical documentation templates.",
                "taskDate": "2026-05-25",
                "category": "Meeting",
                "priority": "medium",
                "assignedDate": "2026-05-20"
            },
            {
                "active": true,
                "newTask": false,
                "completed": false,
                "failed": false,
                "taskTitle": "Fix issue tracker memory leak",
                "taskDescription": "Analyze dynamic rendering profiles in employee dashboard components and resolve garbage collection leak.",
                "taskDate": "2026-06-01",
                "category": "Development",
                "priority": "high",
                "assignedDate": "2026-05-28"
            }
        ]
    },
    {
        "id": 2,
        "firstName": "Sneha",
        "email": "employee2@example.com",
        "password": "123",
        "taskCounts": {
            "active": 1,
            "newTask": 0,
            "completed": 1,
            "failed": 0
        },
        "tasks": [
            {
                "active": true,
                "newTask": false,
                "completed": false,
                "failed": false,
                "taskTitle": "Database query optimization",
                "taskDescription": "Add composite indexes to frequently scanned fields inside the task assignments collection.",
                "taskDate": "2026-06-02",
                "category": "Database",
                "priority": "medium",
                "assignedDate": "2026-05-27"
            },
            {
                "active": false,
                "newTask": false,
                "completed": true,
                "failed": false,
                "taskTitle": "Design sidebar navigation",
                "taskDescription": "Create responsive wireframes and layout paths for the high-end collapsible sidebar drawer.",
                "taskDate": "2026-05-24",
                "category": "Design",
                "priority": "low",
                "assignedDate": "2026-05-21"
            }
        ]
    },
    {
        "id": 3,
        "firstName": "Ravi",
        "email": "employee3@example.com",
        "password": "123",
        "taskCounts": {
            "active": 2,
            "newTask": 1,
            "completed": 1,
            "failed": 0
        },
        "tasks": [
            {
                "active": true,
                "newTask": true,
                "completed": false,
                "failed": false,
                "taskTitle": "Prepare Q3 slide deck",
                "taskDescription": "Consolidate department performance metrics, completed task rates, and upcoming product timelines.",
                "taskDate": "2026-06-10",
                "category": "Marketing",
                "priority": "medium",
                "assignedDate": "2026-05-29"
            },
            {
                "active": true,
                "newTask": false,
                "completed": false,
                "failed": false,
                "taskTitle": "Vite standard audit review",
                "taskDescription": "Review package security alerts and audit package lock configurations.",
                "taskDate": "2026-06-03",
                "category": "QA",
                "priority": "low",
                "assignedDate": "2026-05-27"
            },
            {
                "active": false,
                "newTask": false,
                "completed": true,
                "failed": false,
                "taskTitle": "API load testing",
                "taskDescription": "Conduct load tests up to 5,000 concurrent mock users and record processing timelines.",
                "taskDate": "2026-05-26",
                "category": "QA",
                "priority": "high",
                "assignedDate": "2026-05-22"
            }
        ]
    },
    {
        "id": 4,
        "firstName": "Priya",
        "email": "employee4@example.com",
        "password": "123",
        "taskCounts": {
            "active": 2,
            "newTask": 1,
            "completed": 0,
            "failed": 0
        },
        "tasks": [
            {
                "active": true,
                "newTask": true,
                "completed": false,
                "failed": false,
                "taskTitle": "Document theme token variables",
                "taskDescription": "Draft comprehensive system guidelines explaining HSL custom values and dark mode styling guidelines.",
                "taskDate": "2026-06-07",
                "category": "Documentation",
                "priority": "low",
                "assignedDate": "2026-05-29"
            },
            {
                "active": true,
                "newTask": false,
                "completed": false,
                "failed": false,
                "taskTitle": "Configure GitHub action pipelines",
                "taskDescription": "Establish a unified continuous integration framework to automate ESLint syntax checks and test runs.",
                "taskDate": "2026-06-04",
                "category": "DevOps",
                "priority": "high",
                "assignedDate": "2026-05-28"
            }
        ]
    },
    {
        "id": 5,
        "firstName": "Karan",
        "email": "employee5@example.com",
        "password": "123",
        "taskCounts": {
            "active": 2,
            "newTask": 1,
            "completed": 1,
            "failed": 0
        },
        "tasks": [
            {
                "active": true,
                "newTask": true,
                "completed": false,
                "failed": false,
                "taskTitle": "Optimize image assets",
                "taskDescription": "Compress and convert landing page graphics into optimized formats to ensure premium load times.",
                "taskDate": "2026-06-06",
                "category": "Design",
                "priority": "medium",
                "assignedDate": "2026-05-29"
            },
            {
                "active": false,
                "newTask": false,
                "completed": true,
                "failed": false,
                "taskTitle": "Deploy preview bundle environment",
                "taskDescription": "Set up server triggers to launch isolated build preview containers for every pull request branch.",
                "taskDate": "2026-05-22",
                "category": "DevOps",
                "priority": "high",
                "assignedDate": "2026-05-18"
            },
            {
                "active": true,
                "newTask": false,
                "completed": false,
                "failed": false,
                "taskTitle": "Analyze user navigation maps",
                "taskDescription": "Review mouse recording maps to assess discoverability of task management quick buttons.",
                "taskDate": "2026-06-05",
                "category": "Support",
                "priority": "low",
                "assignedDate": "2026-05-28"
            }
        ]
    }
];

const initialAdmin = [
    {
        "id": 1,
        "email": "admin@me.com",
        "password": "123"
    },
    {
        "id": 2,
        "email": "admin@example.com",
        "password": "123"
    }
];

// Seed to LocalStorage safely (only if not already existing)
export const initializeLocalStorage = () => {
    if (!localStorage.getItem('employees')) {
        localStorage.setItem('employees', JSON.stringify(initialEmployees));
    }
    if (!localStorage.getItem('admin')) {
        localStorage.setItem('admin', JSON.stringify(initialAdmin));
    }
};

// Seeding trigger used for clean resets
export const setLocalStorage = () => {
    localStorage.setItem('employees', JSON.stringify(initialEmployees));
    localStorage.setItem('admin', JSON.stringify(initialAdmin));
};

export const getLocalStorage = () => {
    initializeLocalStorage();
    const employees = JSON.parse(localStorage.getItem('employees'));
    const admin = JSON.parse(localStorage.getItem('admin'));
    return { employees, admin };
};