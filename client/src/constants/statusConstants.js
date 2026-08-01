export const APPLICATION_STATUSES = [
  'Applied',
  'OA',
  'Technical',
  'HR',
  'Selected',
  'Rejected',
];

export const STATUS_CONFIG = {
  Applied: {
    label: 'Applied',
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300',
    color: '#3B82F6',
  },
  OA: {
    label: 'Online Assessment',
    badgeClass: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-300',
    color: '#8B5CF6',
  },
  Technical: {
    label: 'Technical Round',
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300',
    color: '#F59E0B',
  },
  HR: {
    label: 'HR Round',
    badgeClass: 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300 border-pink-300',
    color: '#EC4899',
  },
  Selected: {
    label: 'Selected / Offer',
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300',
    color: '#10B981',
  },
  Rejected: {
    label: 'Rejected',
    badgeClass: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-300',
    color: '#EF4444',
  },
};

export const RESOURCE_CATEGORIES = [
  'DSA',
  'Aptitude',
  'Resume',
  'Interview Experience',
  'Core Subjects',
];

export const RESOURCE_STATUSES = [
  'Not Started',
  'In Progress',
  'Completed',
];

export const INTERVIEW_ROUND_TYPES = [
  'Technical',
  'HR',
  'Behavioral',
  'OA',
  'System Design',
];

export const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard'];
