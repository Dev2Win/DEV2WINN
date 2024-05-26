import React from 'react';

export type TasksProp = {
  task:string;
  completed:boolean;
 }

export type TodosProps = {
  key:string,
  title: string,
  time: string,
  tasks: TasksProp[] | null,
  category: string,
  completed: boolean,
}

const Todo = ({ todos }: TodosProps) => {
  return (
    <section className='text-gray-700 my-6'>
      <div className="flex items-start gap-3">
        <input type="checkbox" name="" id="" className='mt-[8px]'/>
        <div>
          <h1 className='font-bold'>{todos.title}</h1>
          <div className="flex gap-4 items-center">
            <p>{todos.category}</p>
            <div className="w-[2px] h-4 bg-gray-300 my-3"></div>
            <p className='text-orange-600 text-[14px] font-semibold'>{todos.time}</p>
          </div>
        </div>
      </div>

      {todos?.tasks && <div className="w-full h-[1px] bg-gray-300 my-2"></div>}

        <div className="text-gray-600 ml-6">
          {todos.tasks?.map((todo: TasksProp) => (
            <div className='flex gap-3' key={todo.task}>
              <input type="checkbox" name="" id="" />
              <p>{todo.task}</p>
            </div>
          ))}
      </div>
    </section>
  );
};

export default Todo;
