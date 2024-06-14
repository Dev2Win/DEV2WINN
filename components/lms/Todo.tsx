import React from 'react';

// export type TasksProp = {
//   task:string;
//   completed:boolean;
//  }

// export type TodosProps = {
//   key:string,
//   title: string,
//   time: string,
//   tasks: TasksProp[] | null,
//   category: string,
//   completed: boolean,
// }

const Todo = ({ todos }: any) => {
  return (
    <section className='my-6 text-gray-700'>
      <div className="flex items-start gap-3">
        <input type="checkbox" name="" id="" className='mt-[8px]'/>
        <div>
          <h1 className='font-bold'>{todos.title}</h1>
          <div className="flex items-center gap-4">
            <p>{todos.category}</p>
            <div className="my-3 h-4 w-[2px] bg-gray-300"></div>
            <p className='text-[14px] font-semibold text-orange-600'>{todos.time}</p>
          </div>
        </div>
      </div>

      {todos?.tasks && <div className="my-2 h-[1px] w-full bg-gray-300"></div>}

        <div className="ml-6 text-gray-600">
          {todos.tasks?.map((todo:any) => (
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
