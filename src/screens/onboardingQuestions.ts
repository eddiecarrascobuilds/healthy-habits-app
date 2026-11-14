export interface Question {
  id: string
  text: string
  hint?: string
  kind: 'text' | 'choice'
  options?: { value: string; label: string }[]
}

// Plain language only. Never ask for calorie, macro or weight targets.
export const questions: Question[] = [
  { id: 'name', kind: 'text', text: 'What should we call you?', hint: 'Just a first name is fine.' },
  {
    id: 'freeTime', kind: 'choice', text: 'How much free time do you usually have in a day?',
    options: [
      { value: 'lt10', label: 'Less than 10 minutes' },
      { value: '10-20', label: '10 to 20 minutes' },
      { value: '20-40', label: '20 to 40 minutes' },
      { value: '40plus', label: 'More than 40 minutes' },
    ],
  },
  {
    id: 'goal', kind: 'choice', text: 'What would you like to feel more of?',
    options: [
      { value: 'energy', label: 'More energy' },
      { value: 'calm', label: 'Less stress' },
      { value: 'sleep', label: 'Better sleep' },
      { value: 'heart', label: 'A healthier heart' },
    ],
  },
  {
    id: 'watch', kind: 'choice', text: 'Has a doctor asked you to keep an eye on anything?',
    hint: "This helps us suggest the right habits. It isn't medical advice.",
    options: [
      { value: 'none', label: 'Nothing in particular' },
      { value: 'sodium', label: 'Salt (sodium) or blood pressure' },
      { value: 'other', label: 'Something else' },
    ],
  },
  {
    id: 'activity', kind: 'choice', text: 'How active are you right now?',
    options: [
      { value: 'starting', label: "I'm just getting started" },
      { value: 'some', label: 'Active on some days' },
      { value: 'most', label: 'Active most days' },
    ],
  },
]
