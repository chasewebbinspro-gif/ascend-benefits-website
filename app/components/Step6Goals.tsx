'use client'

import { FormData } from '../types'

const PRIORITY_OPTIONS = [
  'Reduce premium costs',
  'Add benefits without raising costs',
  'Attract & retain employees',
  'Improve employee health outcomes',
  'Reduce admin burden',
  'ACA compliance',
  'PCMP',
  'Better coverage for the group',
]

const HEARD_ABOUT_OPTIONS = [
  'Referral from a friend or colleague',
  'Google Search',
  'Social Media (Facebook, LinkedIn, etc.)',
  'Event / Conference',
  'Cold Call / Email',
  'Chamber of Commerce',
  'Other',
]

const BEST_TIME_OPTIONS = [
  'Morning (8am – 12pm)',
  'Afternoon (12pm – 5pm)',
  'Evening (5pm – 8pm)',
  'Anytime works',
]

interface Props {
  formData: FormData
  onChange: (field: keyof FormData, value: string | string[]) => void
  errors: Record<string, string>
}

function togglePriority(current: string[], value: string): string[] {
  return current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value]
}

export default function Step6Goals({ formData, onChange, errors }: Props) {
  return (
    <div>
      <h2 className="step-header">Goals & Pain Points</h2>
      <p className="step-subheader">
        Help us understand what matters most so we can deliver real results — not just a quote.
      </p>

      <div className="section-card">
        <h3 className="text-base font-semibold text-navy mb-3" style={{ fontFamily: 'Georgia, serif' }}>
          Top Priorities <span className="required-star">*</span>
        </h3>
        <p className="text-xs text-gray-500 mb-3">Select all that apply to your business</p>
        <div className="flex flex-wrap gap-2">
          {PRIORITY_OPTIONS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onChange('priorities', togglePriority(formData.priorities, p))}
              className={`chip ${
                formData.priorities.includes(p) ? 'chip-selected' : 'chip-unselected'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        {errors.priorities && <p className="error-text mt-2">{errors.priorities}</p>}
      </div>

      <div className="section-card">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="form-label">Biggest Frustration with Current Benefits</label>
            <textarea
              className="form-input min-h-[100px] resize-y"
              placeholder="What's not working? What keeps you up at night when it comes to benefits?"
              value={formData.biggestFrustration}
              onChange={(e) => onChange('biggestFrustration', e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Anything Else We Should Know?</label>
            <textarea
              className="form-input min-h-[80px] resize-y"
              placeholder="Special circumstances, upcoming changes, questions..."
              value={formData.anythingElse}
              onChange={(e) => onChange('anythingElse', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="section-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">How Did You Hear About Us?</label>
            <select
              className="form-select"
              value={formData.howHeardAboutUs}
              onChange={(e) => onChange('howHeardAboutUs', e.target.value)}
            >
              <option value="">Select...</option>
              {HEARD_ABOUT_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Best Time to Connect</label>
            <select
              className="form-select"
              value={formData.bestTimeToConnect}
              onChange={(e) => onChange('bestTimeToConnect', e.target.value)}
            >
              <option value="">Select...</option>
              {BEST_TIME_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
