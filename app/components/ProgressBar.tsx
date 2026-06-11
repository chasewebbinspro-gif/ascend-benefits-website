'use client'

const STEPS = [
  { num: 1, label: 'Company Info' },
  { num: 2, label: 'Contacts' },
  { num: 3, label: 'Benefits' },
  { num: 4, label: 'Payroll' },
  { num: 5, label: 'Census' },
  { num: 6, label: 'Goals' },
]

interface ProgressBarProps {
  currentStep: number
}

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between relative">
        {/* connector line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-gold z-0 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step) => {
          const isDone = currentStep > step.num
          const isActive = currentStep === step.num

          return (
            <div key={step.num} className="flex flex-col items-center z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                  isDone
                    ? 'bg-gold border-gold text-white'
                    : isActive
                    ? 'bg-navy border-navy text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {isDone ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.num
                )}
              </div>
              <span
                className={`mt-1 text-xs font-medium hidden sm:block ${
                  isActive ? 'text-navy' : isDone ? 'text-gold' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
