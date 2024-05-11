'use client';
import React, { ReactNode, useState } from 'react';
import { FaLinkedin, FaTwitter } from 'react-icons/fa';
import { CiLink } from 'react-icons/ci';

interface MyComponentsProp {
  children: ReactNode;
  collapsedNumWords?: number;
  expandButtonText?: string;
  collapseButtonText?: string;
  buttonColor?: string;
  expanded?: boolean;
  className?: string;
}

const TextExpander: React.FC<MyComponentsProp> = ({
  children,
  collapsedNumWords = 10,
  expandButtonText = 'Show more',
  collapseButtonText = '',
  buttonColor = '#1f09cd',
  expanded = false,
  className,
}) => {
 const [isExpanded, setIsExpanded] = useState(expanded);

 // Convert children to a string if it's not already a string
 const childrenAsString =
   typeof children === 'string'
     ? children
     : React.Children.toArray(children).join(''); // Use React.Children.toArray to handle arrays and non-string values

 const words = childrenAsString.split(/\s+/);
 const displayText = isExpanded
   ? childrenAsString
   : words.slice(0, collapsedNumWords).join(' ') + '...';

  const buttonStyle = {
    background: 'none',
    border: 'none',
    font: 'inherit',
    cursor: 'pointer',
    marginLeft: '6px',
    color: buttonColor,
  };

  return (
    <div className={className}>
      <span>{displayText}</span>
      <button onClick={() => setIsExpanded((exp) => !exp)} style={buttonStyle}>
        {isExpanded ? collapseButtonText : expandButtonText}
      </button>
    </div>
  );
};

const About = () => {
  return (
    <div>
      <TextExpander
        collapsedNumWords={20}
        expandButtonText="Show More"
        // collapseButtonText="Show less"
        className="text-"
      >
        Since beginning my journey as a freelance developer nearly 5 years ago,
        I&apos;ve done remote work for agencies, and collaborated with talented
        people to create digital products for both business and consumer use.
      </TextExpander>
      <div className="pt-8 flex gap-4">
        <div className="border p-2 rounded-full bg-slate-200">
          <FaLinkedin className="" />
        </div>
        <div className="border p-2 rounded-full bg-slate-200">
          <FaTwitter />
        </div>
        <div className="border p-2 rounded-full bg-slate-200">
          <CiLink />
        </div>
      </div>
    </div>
  );
};

export default About;
