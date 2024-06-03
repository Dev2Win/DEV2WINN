import frontend from '../public/images/frontend.svg';

export const course = {
  courseTitle: "Fullstack Web Development Course",
  courseLogo: frontend,
  courseroadmap: [
    {
      id: 1,
      title: "Introduction to Web Development",
      submodules: [
        {
          id: 1.1,
          title: "Overview of Web Development",
          content: "Write an introductory article explaining what web development is, its importance, and different types of web development (frontend, backend, full-stack).\nActivity: Create a quiz to test understanding of web development basics."
        },
        {
          id: 1.2,
          title: "Understanding How the Web Works",
          content: "Produce a video explaining how the internet works, covering topics like DNS, HTTP/HTTPS, and client-server architecture.\nActivity: Interactive diagram labeling exercise."
        }
      ]
    },
    {
      id: 2,
      title: "HTML and CSS Basics",
      submodules: [
        {
          id: 2.1,
          title: "Introduction to HTML",
          content: "Write an article detailing the structure of an HTML document, common tags, and their purposes.\nTutorial: Build a simple webpage using basic HTML elements."
        },
        {
          id: 2.2,
          title: "Introduction to CSS",
          content: "Create a video tutorial on how to link CSS to HTML, basic CSS syntax, and styling text and elements.\nActivity: Style the webpage created in the HTML tutorial."
        },
        {
          id: 2.3,
          title: "Building Your First Web Page",
          content: "Step-by-step guide on creating a personal portfolio page using HTML and CSS.\nProject: Students build and share their own portfolio page."
        },
        {
          id: 2.4,
          title: "Advanced HTML Elements",
          content: "Write an article covering forms, tables, and semantic HTML.\nActivity: Create a contact form and a data table in HTML."
        },
        {
          id: 2.5,
          title: "Advanced CSS Techniques",
          content: "Article on advanced CSS topics like pseudo-classes, pseudo-elements, and advanced selectors.\nTutorial: Design a card component using advanced CSS techniques."
        }
      ]
    },
    {
      id: 3,
      title: "Responsive Web Design",
      submodules: [
        {
          id: 3.1,
          title: "Introduction to Responsive Design",
          content: "Write an article explaining the principles of responsive design and why it's important.\nActivity: Analyze and critique the responsiveness of various websites."
        },
        {
          id: 3.2,
          title: "Media Queries",
          content: "Create a video tutorial on using media queries to create responsive layouts.\nActivity: Add media queries to the portfolio page to make it responsive."
        },
        {
          id: 3.3,
          title: "Flexbox and Grid Layouts",
          content: "Write detailed guides on Flexbox and Grid, with examples.\nTutorial: Create a responsive navigation bar and layout using Flexbox and Grid.\nProject: Redesign a webpage layout using Flexbox and Grid."
        }
      ]
    },
    {
      id: 4,
      title: "JavaScript Basics",
      submodules: [
        {
          id: 4.1,
          title: "Introduction to JavaScript",
          content: "Write an article introducing JavaScript, including syntax, data types, and basic operators.\nTutorial: Basic exercises to practice variables and operators."
        },
        {
          id: 4.2,
          title: "Variables, Data Types, and Operators",
          content: "Video tutorial covering variables, data types, and operators in-depth.\nActivity: Interactive coding exercises."
        },
        {
          id: 4.3,
          title: "Functions and Control Flow",
          content: "Write an article on functions, conditionals, and loops.\nTutorial: Create a simple JavaScript program using functions and control flow."
        },
        {
          id: 4.4,
          title: "DOM Manipulation",
          content: "Article and video on DOM manipulation basics.\nActivity: Modify the portfolio page dynamically using JavaScript."
        },
        {
          id: 4.5,
          title: "Events and Event Handling",
          content: "Video tutorial on event handling in JavaScript.\nProject: Build an interactive to-do list application."
        }
      ]
    },
    {
      id: 5,
      title: "Advanced JavaScript",
      submodules: [
        {
          id: 5.1,
          title: "ES6 and Beyond",
          content: "Write an article on ES6 features like let/const, arrow functions, template literals, and destructuring.\nActivity: Refactor previous JavaScript code to use ES6 features."
        },
        {
          id: 5.2,
          title: "Asynchronous JavaScript",
          content: "Video tutorial on promises, async/await, and handling asynchronous code.\nProject: Fetch data from a public API and display it on a webpage."
        },
        {
          id: 5.3,
          title: "Fetch API and AJAX",
          content: "Article on using Fetch API to make network requests.\nTutorial: Create a simple web application that fetches and displays data."
        },
        {
          id: 5.4,
          title: "Error Handling",
          content: "Write an article on error handling in JavaScript.\nActivity: Implement error handling in the API fetching project."
        }
      ]
    },
    {
      id: 6,
      title: "Version Control with Git",
      submodules: [
        {
          id: 6.1,
          title: "Introduction to Git",
          content: "Write an article explaining what Git is and its importance.\nTutorial: Set up a Git repository and learn basic Git commands."
        },
        {
          id: 6.2,
          title: "Basic Git Commands",
          content: "Create a detailed guide on basic Git commands (clone, commit, push, pull).\nActivity: Collaborative project using GitHub."
        },
        {
          id: 6.3,
          title: "GitHub for Collaboration",
          content: "Article on using GitHub for version control and collaboration.\nProject: Collaborate on a shared repository and manage pull requests."
        }
      ]
    },
    {
      id: 7,
      title: "Package Managers and Build Tools",
      submodules: [
        {
          id: 7.1,
          title: "Introduction to npm and Yarn",
          content: "Write an article explaining package managers and their usage.\nTutorial: Set up a project using npm/Yarn."
        },
        {
          id: 7.2,
          title: "Introduction to Webpack",
          content: "Article on what Webpack is and why it’s used.\nTutorial: Configure Webpack for a simple project."
        },
        {
          id: 7.3,
          title: "Setting Up a Build Process",
          content: "Write an article on setting up a build process with Webpack.\nActivity: Optimize a project using Webpack plugins and loaders."
        }
      ]
    },
    {
      id: 8,
      title: "Frameworks and Libraries",
      submodules: [
        {
          id: 8.1,
          title: "Introduction to React",
          content: "Write an article introducing React and its core concepts.\nTutorial: Create a simple React application."
        },
        {
          id: 8.2,
          title: "State Management with Redux",
          content: "Article and video on state management in React using Redux.\nProject: Build a small application using React and Redux."
        },
        {
          id: 8.3,
          title: "Component-Based Architecture",
          content: "Write an article on component-based architecture in React.\nActivity: Refactor the previous React project to use reusable components."
        },
        {
          id: 8.4,
          title: "Introduction to Vue.js",
          content: "Write an introductory article on Vue.js.\nTutorial: Create a simple Vue.js application."
        },
        {
          id: 8.5,
          title: "Introduction to Angular",
          content: "Article on getting started with Angular.\nTutorial: Build a basic Angular application."
        }
      ]
    },
    {
      id: 9,
      title: "Testing and Debugging",
      submodules: [
        {
          id: 9.1,
          title: "Introduction to Testing",
          content: "Write an article on the importance of testing in software development.\nTutorial: Set up a testing environment."
        },
        {
          id: 9.2,
          title: "Unit Testing with Jest",
          content: "Article and video tutorial on writing unit tests with Jest.\nActivity: Write unit tests for a JavaScript project."
        },
        {
          id: 9.3,
          title: "Debugging Techniques",
          content: "Write an article on common debugging techniques.\nActivity: Debug a series of provided code snippets with common errors."
        }
      ]
    },
    {
      id: 10,
      title: "Performance Optimization",
      submodules: [
        {
          id: 10.1,
          title: "Introduction to Web Performance",
          content: "Write an article on why web performance matters.\nTutorial: Use browser dev tools to measure and improve performance."
        },
        {
          id: 10.2,
          title: "Lazy Loading and Code Splitting",
          content: "Write an article explaining lazy loading and code splitting.\nActivity: Implement lazy loading and code splitting in a project."
        },
        {
          id: 10.3,
          title: "Caching Strategies",
          content: "Article on caching strategies for web applications.\nTutorial: Implement caching in a web application."
        }
      ]
    },
    {
      id: 11,
      title: "Deployment and Hosting",
      submodules: [
        {
          id: 11.1,
          title: "Introduction to Web Hosting",
          content: "Write an article on different web hosting options.\nTutorial: Deploy a website to a hosting service."
        },
        {
          id: 11.2,
          title: "Continuous Integration and Deployment",
          content: "Write an article on CI/CD principles.\nActivity: Set up a CI/CD pipeline using a service like GitHub Actions."
        },
        {
          id: 11.3,
          title: "Deploying Applications with Netlify",
          content: "Article on how to deploy applications with Netlify.\nProject: Deploy a React application to Netlify."
        }
      ]
    }
  ]
};
