import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthProvider'

const CreateTask = () => {

    const [userData, setUserData] = useContext(AuthContext)

    const [taskTitle, setTaskTitle] = useState('')
    const [taskDescription, setTaskDescription] = useState('')
    const [taskDate, setTaskDate] = useState('')
    const [asignTo, setAsignTo] = useState('')
    const [category, setCategory] = useState('')

    const submitHandler = (e) => {
        e.preventDefault()

        // ✅ create task object
        const newTask = {
            taskTitle,
            taskDescription,
            taskDate,
            category,
            active: false,
            newTask: true,
            failed: false,
            completed: false
        }

        // ✅ update employee data (IMMUTABLE)
        const updatedData = userData.map((emp) => {

            if (emp.firstName.toLowerCase() === asignTo.toLowerCase()) {
                return {
                    ...emp,
                    tasks: [...emp.tasks, newTask],
                    taskCounts: {
                        ...emp.taskCounts,
                        newTask: emp.taskCounts.newTask + 1
                    }
                }
            }
            

            return emp
        })

        // ✅ update context
        setUserData(updatedData)

        // ✅ update localStorage
        localStorage.setItem('employees', JSON.stringify(updatedData))

        console.log("Task Added:", updatedData)

        // ✅ clear form
        setTaskTitle('')
        setTaskDescription('')
        setTaskDate('')
        setAsignTo('')
        setCategory('')
        console.log("Assigning to:", asignTo)
console.log("All users:", userData)
    }

    return (
        <div className='p-5 bg-[#1c1c1c] mt-5 rounded'>

            <form 
                onSubmit={submitHandler}
                className='flex flex-wrap w-full items-start justify-between'
            >

                {/* LEFT SIDE */}
                <div className='w-1/2'>

                    <div>
                        <h3 className='text-sm text-gray-300 mb-1'>Task Title</h3>
                        <input
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            className='text-sm py-1 px-2 w-4/5 rounded bg-transparent border border-gray-400 mb-4 text-white'
                            type="text"
                            placeholder='Enter task title'
                            required
                        />
                    </div>

                    <div>
                        <h3 className='text-sm text-gray-300 mb-1'>Date</h3>
                        <input
                            value={taskDate}
                            onChange={(e) => setTaskDate(e.target.value)}
                            className='text-sm py-1 px-2 w-4/5 rounded bg-transparent border border-gray-400 mb-4 text-white'
                            type="date"
                            required
                        />
                    </div>

                    <div>
                        <h3 className='text-sm text-gray-300 mb-1'>Assign To</h3>
                        <input
                            value={asignTo}
                            onChange={(e) => setAsignTo(e.target.value)}
                            className='text-sm py-1 px-2 w-4/5 rounded bg-transparent border border-gray-400 mb-4 text-white'
                            type="text"
                            placeholder='Enter employee name (e.g. Arjun)'
                            required
                        />
                    </div>

                    <div>
                        <h3 className='text-sm text-gray-300 mb-1'>Category</h3>
                        <input
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className='text-sm py-1 px-2 w-4/5 rounded bg-transparent border border-gray-400 mb-4 text-white'
                            type="text"
                            placeholder='Design / Development'
                            required
                        />
                    </div>

                </div>

                {/* RIGHT SIDE */}
                <div className='w-2/5 flex flex-col'>

                    <h3 className='text-sm text-gray-300 mb-1'>Description</h3>

                    <textarea
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                        className='w-full h-44 text-sm py-2 px-4 rounded bg-transparent border border-gray-400 text-white'
                        placeholder='Enter task description'
                        required
                    ></textarea>

                    <button className='bg-emerald-500 hover:bg-emerald-600 py-3 px-5 rounded text-sm mt-4'>
                        Create Task
                    </button>

                </div>

            </form>
        </div>
    )
}

export default CreateTask