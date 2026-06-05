'use client';
import QuestionPage from '@/components/explore/QuestionPage';
import { useSearchParams } from 'next/navigation';


export default function RenderExplore() {
  const searchParams = useSearchParams();
  const id = searchParams.get('postId');

  // Sample question data with answers
  const questionData = {
    id: id || '1',
    title: 'How can you prioritize tasks to drive your career development?',
    content:
      'Im looking for effective strategies to prioritize tasks that will help advance my career. What methods do you use to ensure youre focusing on the most impactful activities for professional growth?',
    createdAt: '2024-07-12T10:30:00Z',
    user: {
      name: 'Career Seeker',
      avatar: 'https://example.com/avatars/career_seeker.jpg',
    },
    answers: [
      {
        id: 1,
        user: {
          name: 'Laura K.',
          avatar: 'https://example.com/avatars/laura_k.jpg',
        },
        content:
          'When I was working toward a promotion, I asked my manager for more responsibilities to help me grow into a Principal UX Designer role, and he assigned a variety of additional tasks to me. I evaluated the importance of asking myself, "Which of these tasks best aligns with my career development journey?" Taking on any additional work that directly supported my role\'s growth was my priority as I only accepted opportunities that aligned with the career growth objectives, and my contributions were acknowledged during performance reviews, contributing to my career growth.',
        votes: 15,
        createdAt: '2024-07-12T11:45:00Z',
      },
      {
        id: 2,
        user: {
          name: 'Chi Chen',
          avatar: 'https://example.com/avatars/chi_chen.jpg',
        },
        content:
          'First, understand that you have the most control over your tasks, despite any pressure from work or other people. Second, evaluate what each task can bring you: I like using the framework of "Learn or earn". If a task can provide both, that\'s great. If it fulfills neither, it\'s worth doing. If it satisfies neither, then avoid it.',
        votes: 8,
        createdAt: '2024-07-12T13:20:00Z',
      },
      {
        id: 3,
        user: {
          name: 'Fabrizio Torelli',
          avatar: 'https://example.com/avatars/fabrizio_t.jpg',
        },
        content:
          "Prioritizing tasks for career development is all about focusing on what moves the needle. Start by identifying your long-term career goals and then break those down into smaller, actionable objectives. It's crucial to regularly review and align your daily tasks with these objectives, ensuring each task contributes to your broader career aspirations. Prioritizing learning and skill development time, allocate time each week to learn new technologies, or reading. Also, don't underestimate the value of networking and seeking feedback. Make it a point to connect with mentors or peers who can provide insights and advice. Remember, it's about making intentional choices daily that align with where you want to go in your career.",
        votes: 12,
        createdAt: '2024-07-12T14:55:00Z',
      },
      {
        id: 4,
        user: {
          name: 'Ravi Patel',
          avatar: 'https://example.com/avatars/ravi_p.jpg',
        },
        content:
          "First, understand what drives you to move forward in your career. Are there any specific value-adds that you think is really important to your career choice? Knowing what drives you really helps to set your focus because you don't feel like doing these tasks as chores, but as something that's sparks your interest. Second, try to minimize the source of potential distractions that could be reason for procrastination. Set the best for your social media, or put your phone in a do not disturb mode. Focus on one thing for a little at a time. When I do other things that don't have a direct link to the tasks related to my career, I will plan my schedule properly beforehand, or I may set an alarm. I watch tv/netflix from my waiting list and try to not multitask while I'm doing the tasks, and vice versa.",
        votes: 6,
        createdAt: '2024-07-12T16:10:00Z',
      },
      {
        id: 5,
        user: {
          name: 'Elena Rodriguez',
          avatar: 'https://example.com/avatars/elena_r.jpg',
        },
        content:
          "In my experience, the key to prioritizing tasks for career development lies in strategic planning and consistent execution. Here's my approach:\n\n1. Set clear goals: Define your short-term and long-term career objectives.\n2. Skill gap analysis: Identify the skills you need to acquire or improve to reach your goals.\n3. Create a learning plan: Based on your skill gaps, create a structured plan for skill acquisition.\n4. Time blocking: Allocate specific time slots in your schedule for career development activities.\n5. Leverage your current role: Look for opportunities in your daily work to practice new skills or take on challenging projects.\n6. Network strategically: Attend industry events, join professional groups, and connect with mentors in your field.\n7. Regular review and adjustment: Periodically assess your progress and adjust your priorities as needed.\n\nRemember, consistency is key. Even small daily actions, when done consistently, can lead to significant career growth over time.",
        votes: 10,
        createdAt: '2024-07-12T17:30:00Z',
      },
    ],
  };

  return <QuestionPage question={questionData} />;
}
