import React from 'react';
import BackgroundComp from './BackgroundComp';

const Background: React.FC = () => {
  const expertise = [
    'Product',
    'Engineering',
    'Mathematics',
    'Education',
    'Zoology',
  ];
  const disciplines = [
    'UX Design',
    'UI/ Visual Design',
    'web Design',
    'Cartoon Artist',
  ];
  const industries = ['🚀Start-up', '🖥️Web3'];
  const fluentin = ['English'];

  return (
    <div>
      <BackgroundComp
        expertise={expertise}
        disciplines={disciplines}
        industries={industries}
        fluentin={fluentin}
      />
      {/* Other components */}
    </div>
  );
};

export default Background;
