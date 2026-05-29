import React from 'react';

const TaskListNumbers = () => {
  return (
    <div className='flex justify-between gap-5 mt-10 screen'>
        <div className=' w-[45%] bg-red-400 rounded-xl py-6 px-9  '>
        <h2 className='text-3xl font-semibold'>0</h2>
        <h3 className='text-xl font-medium'>New Task</h3>

        </div>
        <div className=' w-[45%] bg-red-400 rounded-xl py-6 px-9  '>
        <h2 className='text-3xl font-semibold'>0</h2>
        <h3 className='text-xl font-medium'>Completed</h3>

        </div>
        <div className=' w-[45%] bg-red-400 rounded-xl py-6 px-9  '>
        <h2 className='text-3xl font-semibold'>0</h2>
        <h3 className='text-xl font-medium'>Accepted</h3>

        </div>
        <div className=' w-[45%] bg-red-400 rounded-xl py-6 px-9  '>
        <h2 className='text-3xl font-semibold'>0</h2>
        <h3 className='text-xl font-medium'>Failed</h3>

        </div>

        
     </div>
    
    
  );
}

export default TaskListNumbers;
