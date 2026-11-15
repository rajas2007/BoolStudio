import { WordProblem } from '../types';

export const WORD_PROBLEMS: WordProblem[] = [
  {
    id: 'tech-club-100',
    title: 'The College Tech Club',
    category: '3-Set Union & Complement',
    description:
      'In a computer engineering cohort of 100 students, 45 take Python, 50 take Web Development, and 40 take Data Science. 25 take Python and Web Dev, 20 take Python and Data Science, 15 take Web Dev and Data Science, and 10 take all three.',
    varCount: 3,
    setNames: {
      A: 'Python',
      B: 'Web Dev',
      C: 'Data Science',
    },
    inputs: {
      varCount: 3,
      universal: 100,
      cardA: 45,
      cardB: 50,
      cardC: 40,
      cardA_B: 25,
      cardA_C: 20,
      cardB_C: 15,
      cardA_B_C: 10,
    },
    targetQuestion: 'How many students take at least one course, and how many take none?',
    targetRegionMasks: [1, 2, 3, 4, 5, 6, 7], // Union
    expectedAnswer: 85,
    explanation:
      'By the 3-set Inclusion-Exclusion formula: |A ∪ B ∪ C| = (45 + 50 + 40) − (25 + 20 + 15) + 10 = 135 − 60 + 10 = 85. The number of students taking none is |U| − 85 = 100 − 85 = 15.',
  },
  {
    id: 'sports-survey-120',
    title: 'High School Sports Survey',
    category: '2-Set Exclusive Regions',
    description:
      'A survey of 120 student athletes found that 70 play football and 55 play basketball, while 30 play both sports.',
    varCount: 2,
    setNames: {
      A: 'Football',
      B: 'Basketball',
    },
    inputs: {
      varCount: 2,
      universal: 120,
      cardA: 70,
      cardB: 55,
      cardA_B: 30,
    },
    targetQuestion: 'How many athletes play Football ONLY?',
    targetRegionMasks: [1], // Only A
    expectedAnswer: 40,
    explanation:
      'The number who play only football is |A| − |A ∩ B| = 70 − 30 = 40. Furthermore, total playing at least one is 70 + 55 − 30 = 95, meaning 120 − 95 = 25 play neither.',
  },
  {
    id: 'devops-tools-150',
    title: 'DevOps Cloud Engineers',
    category: '3-Set Single Region',
    description:
      'Among 150 cloud engineers, 90 use Docker, 75 use Kubernetes, and 60 use Terraform. 45 use Docker and Kubernetes, 35 use Docker and Terraform, 30 use Kubernetes and Terraform, and 20 use all three tools.',
    varCount: 3,
    setNames: {
      A: 'Docker',
      B: 'Kubernetes',
      C: 'Terraform',
    },
    inputs: {
      varCount: 3,
      universal: 150,
      cardA: 90,
      cardB: 75,
      cardC: 60,
      cardA_B: 45,
      cardA_C: 35,
      cardB_C: 30,
      cardA_B_C: 20,
    },
    targetQuestion: 'How many engineers use Docker ONLY?',
    targetRegionMasks: [1], // Only A
    expectedAnswer: 30,
    explanation:
      'Region A only = |A| − (r_AB + r_AC + r_ABC) where r_AB = 45 − 20 = 25, r_AC = 35 − 20 = 15, and r_ABC = 20. Thus, A only = 90 − 25 − 15 − 20 = 30.',
  },
  {
    id: 'languages-200',
    title: 'University Language Department',
    category: '3-Set Symmetric Overlaps',
    description:
      'In a cohort of 200 language majors: 80 study Spanish, 70 study German, and 60 study French. 30 study Spanish & German, 25 study Spanish & French, 20 study German & French, and 15 study all three.',
    varCount: 3,
    setNames: {
      A: 'Spanish',
      B: 'German',
      C: 'French',
    },
    inputs: {
      varCount: 3,
      universal: 200,
      cardA: 80,
      cardB: 70,
      cardC: 60,
      cardA_B: 30,
      cardA_C: 25,
      cardB_C: 20,
      cardA_B_C: 15,
    },
    targetQuestion: 'How many students study EXACTLY TWO languages?',
    targetRegionMasks: [3, 5, 6], // Pairwise disjoint intersections
    expectedAnswer: 30,
    explanation:
      'The pairwise-only regions are: Spanish & German only = 30 − 15 = 15; Spanish & French only = 25 − 15 = 10; German & French only = 20 − 15 = 5. Total studying exactly two = 15 + 10 + 5 = 30.',
  },
];
