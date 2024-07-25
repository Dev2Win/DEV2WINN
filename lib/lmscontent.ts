import frontend from '../public/images/frontend.svg';
import { IoMdAnalytics } from 'react-icons/io';

export const courses = [
  {
    id: 123,
    title: 'Software Development',
    icon: IoMdAnalytics,
    booksCount: 120,
    studentsCount: 45,
    assignmentCounts: 30,
    bgColor: 'rgba(131, 14, 249, 0.2)',
    courseLogo: frontend,
    courseroadmap: [
      {
        id: 1,
        title: 'Introduction to Web Development',
        submodules: [
          {
            id: 1.1,
            title: 'Overview of Web Development',
            content:
              'Write an introductory article explaining what web development is, its importance, and different types of web development (frontend, backend, full-stack).\nActivity: Create a quiz to test understanding of web development basics.',
          },
          {
            id: 1.2,
            title: 'Understanding How the Web Works',
            content:
              'Produce a video explaining how the internet works, covering topics like DNS, HTTP/HTTPS, and client-server architecture.\nActivity: Interactive diagram labeling exercise.',
          },
        ],
      },
      {
        id: 2,
        title: 'HTML and CSS Basics',
        submodules: [
          {
            id: 2.1,
            title: 'Introduction to HTML',
            content:
              'Write an article detailing the structure of an HTML document, common tags, and their purposes.\nTutorial: Build a simple webpage using basic HTML elements.',
          },
          {
            id: 2.2,
            title: 'Introduction to CSS',
            content:
              'Create a video tutorial on how to link CSS to HTML, basic CSS syntax, and styling text and elements.\nActivity: Style the webpage created in the HTML tutorial.',
          },
          {
            id: 2.3,
            title: 'Building Your First Web Page',
            content:
              'Step-by-step guide on creating a personal portfolio page using HTML and CSS.\nProject: Students build and share their own portfolio page.',
          },
          {
            id: 2.4,
            title: 'Advanced HTML Elements',
            content:
              'Write an article covering forms, tables, and semantic HTML.\nActivity: Create a contact form and a data table in HTML.',
          },
          {
            id: 2.5,
            title: 'Advanced CSS Techniques',
            content:
              'Article on advanced CSS topics like pseudo-classes, pseudo-elements, and advanced selectors.\nTutorial: Design a card component using advanced CSS techniques.',
          },
        ],
      },
    ],
  },

  {
    id: 234,
    title: 'UI/UX Design',
    icon: IoMdAnalytics,
    booksCount: 150,
    studentsCount: 50,
    assignmentCounts: 25,
    bgColor: 'rgba(80, 168, 50, 0.2)',
    courseLogo: frontend,
    courseroadmap: [
      {
        id: 12,
        title: 'Introduction to UI/UX',
        submodules: [
          {
            id: 12.1,
            title: 'Introduction to UI/UX',
            content:
              'Write an article explaining the fundamentals of UI/UX design.\nActivity: Analyze and critique different website designs.',
          },
          {
            id: 12.2,
            title: 'Wireframing and Prototyping',
            content:
              'Create a video tutorial on wireframing and prototyping using tools like Figma.\nActivity: Create a wireframe for a web application.',
          },
          {
            id: 12.3,
            title: 'Design Principles',
            content:
              'Write an article on design principles such as contrast, alignment, and balance.\nActivity: Redesign a webpage to improve its UI/UX.',
          },
          {
            id: 12.4,
            title: 'Usability Testing',
            content:
              'Produce a video on conducting usability tests.\nActivity: Conduct a usability test and report findings.',
          },
        ],
      },
    ],
  },
  {
    id: 345,
    title: 'AI/ML',
    icon: IoMdAnalytics,
    booksCount: 60,
    studentsCount: 30,
    assignmentCounts: 10,
    bgColor: 'rgba(14, 120, 249, 0.2)',
    courseLogo: frontend,
    courseroadmap: [
      {
        id: 13,
        title: 'Introduction to AI/ML',
        submodules: [
          {
            id: 13.1,
            title: 'Introduction to AI/ML',
            content:
              'Write an article explaining what AI and ML are and their significance.\nActivity: Create a simple AI model using a pre-built library.',
          },
          {
            id: 13.2,
            title: 'Basic Machine Learning Concepts',
            content:
              'Create a video tutorial on basic ML concepts like regression and classification.\nActivity: Implement a basic ML algorithm in Python.',
          },
          {
            id: 13.3,
            title: 'Neural Networks and Deep Learning',
            content:
              'Write an article on neural networks and how they work.\nTutorial: Build a simple neural network using TensorFlow or PyTorch.',
          },
          {
            id: 13.4,
            title: 'AI Ethics and Bias',
            content:
              'Produce a video on ethical considerations in AI.\nActivity: Analyze a case study on AI bias.',
          },
        ],
      },
    ],
  },
  {
    id: 456,
    title: 'Data Analysis',
    icon: IoMdAnalytics,
    booksCount: 80,
    studentsCount: 60,
    assignmentCounts: 15,
    bgColor: 'rgba(201, 22, 2, 0.2)',
    courseLogo: frontend,
    courseroadmap: [
      {
        id: 14,
        title: 'Introduction to Data Analysis',
        submodules: [
          {
            id: 14.1,
            title: 'Introduction to Data Analysis',
            content:
              'Write an article on the basics of data analysis and its importance.\nActivity: Analyze a small dataset using Excel or Google Sheets.',
          },
          {
            id: 14.2,
            title: 'Data Cleaning and Preparation',
            content:
              'Create a video tutorial on data cleaning and preparation techniques.\nActivity: Clean a provided dataset and prepare it for analysis.',
          },
          {
            id: 14.3,
            title: 'Data Visualization',
            content:
              'Write an article on data visualization principles and tools.\nTutorial: Create visualizations using tools like Tableau or Power BI.',
          },
          {
            id: 14.4,
            title: 'Statistical Analysis',
            content:
              'Produce a video on basic statistical analysis methods.\nActivity: Perform statistical analysis on a provided dataset.',
          },
        ],
      },
    ],
  },
  {
    id: 567,
    title: 'Business Intelligence',
    icon: IoMdAnalytics,
    booksCount: 100,
    studentsCount: 40,
    assignmentCounts: 20,
    bgColor: 'rgba(28, 31, 46, 0.2)',
    courseLogo: frontend,
    courseroadmap: [
      {
        id: 15,
        title: 'Introduction to Business Intelligence',
        submodules: [
          {
            id: 15.1,
            title: 'Introduction to Business Intelligence',
            content:
              'Write an article on what business intelligence is and its role in decision making.\nActivity: Analyze a business case study using BI principles.',
          },
          {
            id: 15.2,
            title: 'BI Tools and Techniques',
            content:
              'Create a video tutorial on popular BI tools like Power BI, Tableau, and QlikView.\nActivity: Create a BI report using one of these tools.',
          },
          {
            id: 15.3,
            title: 'Data Warehousing',
            content:
              'Write an article on data warehousing concepts and design.\nTutorial: Design a simple data warehouse schema.',
          },
          {
            id: 15.4,
            title: 'BI Reporting and Dashboards',
            content:
              'Produce a video on creating reports and dashboards in BI tools.\nActivity: Build a dashboard to visualize key business metrics.',
          },
        ],
      },
    ],
  },
];

export const posts = [
  {
    id: 123,
    title: 'Software Development',
    desc: 'Write an introductory article explaining what web development is, its i',
    booksCount: 120,
    studentsCount: 45,
    assignmentCounts: 30,
    bgColor: 'rgba(131, 14, 249, 0.2)',
    courseLogo: frontend,
  },

  {
    id: 234,
    title: 'UI/UX Design',
    desc: 'Write an introductory article explaining what web development is, its i',

    booksCount: 150,
    studentsCount: 50,
    assignmentCounts: 25,
    bgColor: 'rgba(80, 168, 50, 0.2)',
    courseLogo: frontend,
  },
  {
    id: 345,
    title: 'AI/ML',
    desc: 'Write an introductory article explaining what web development is, its i',

    booksCount: 60,
    studentsCount: 30,
    assignmentCounts: 10,
    bgColor: 'rgba(14, 120, 249, 0.2)',
    courseLogo: frontend,
  },
  {
    id: 456,
    title: 'Data Analysis',
    desc: 'Write an introductory article explaining what web development is, its i',

    booksCount: 80,
    studentsCount: 60,
    assignmentCounts: 15,
    bgColor: 'rgba(201, 22, 2, 0.2)',
    courseLogo: frontend,
  },
  {
    id: 567,
    title: 'Business Intelligence',
    desc: 'Write an introductory article explaining what web development is, its i',

    booksCount: 100,
    studentsCount: 40,
    assignmentCounts: 20,
    bgColor: 'rgba(28, 31, 46, 0.2)',
    courseLogo: frontend,
  },
];
