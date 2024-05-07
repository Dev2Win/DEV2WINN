import React from 'react'

const Stepper = () => {

    const steps = ['Welcome', 'Workspace', 'User type', 'Complete']
  return (
    <div className='flex justify-between '>
        {steps?.map((step, i) => (
          <div key={i} className='relative flex flex-col items-center justify-center w-36 step-item'>
            <div>{i + 1}</div>
            <small>{step}</small>
          </div>
        ))}
    </div>
  )
}

export default Stepper