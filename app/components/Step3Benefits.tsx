'use client'

import { FormData } from '../types'

const CARRIER_OPTIONS = [
  'BCBS', 'UHC', 'Aetna', 'Cigna', 'Humana',
  'Oscar', 'Anthem', 'Kaiser', 'Other', 'None',
]

const OTHER_BENEFIT_OPTIONS = [
  'Dental',
  'Vision',
  'Life Insurance',
  'Disability',
  'FSA/HSA',
  '401k',
  'GAP Plan',
  'Cancer/Critical Illness',
  'Whole Life',
  'Preventive Care Mgmt (PCMP)',
  'None',
]

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

interface Props {
  formData: FormData
  onChange: (field: keyof FormData, value: string | string[]) => void
  errors: Record<string, string>
}

function toggleChip(current: string[], value: string): string[] {
  if (value === 'None') return ['None']
  const withoutNone = current.filter((v) => v !== 'None')
  return withoutNone.includes(value)
    ? withoutNone.filter((v) => v !== value)
    : [...withoutNone, value]
}

export default function Step3Benefits({ formData, onChange, errors }: Props) {
  return (
    <div>
      <h2 className="step-header">Current Benefits & Carriers</h2>
      <p className="step-subheader">Help us understand what coverage you currently have in place.</p>

      <div className="section-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">
              Do you currently offer health insurance? <span className="required-star">*</span>
            </label>
            <select
              className="form-select"
              value={formData.hasHealthInsurance}
              onChange={(e) => onChange('hasHealthInsurance', e.target.value)}
            >
              <option value="">Select...</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Looking to start">Looking to start</option>
            </select>
            {errors.hasHealthInsurance && <p className="error-text">{errors.hasHealthInsurance}</p>}
          </div>

          <div>
            <label className="form-label">Plan Renewal Month</label>
            <select
              className="form-select"
              value={formData.planRenewalMonth}
              onChange={(e) => onChange('planRenewalMonth', e.target.value)}
            >
              <option value="">Select month</option>
              {MONTHS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="form-label">Monthly Employer Premium (approx.)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
              <input
                type="number"
                className="form-input pl-7"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={formData.monthlyEmployerPremium}
                onChange={(e) => onChange('monthlyEmployerPremium', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="section-card">
        <h3 className="text-base font-semibold text-navy mb-3" style={{ fontFamily: 'Georgia, serif' }}>
          Current Health Carriers
        </h3>
        <div className="flex flex-wrap gap-2">
          {CARRIER_OPTIONS.map((carrier) => (
            <button
              key={carrier}
              type="button"
              onClick={() => onChange('currentCarriers', toggleChip(formData.currentCarriers, carrier))}
              className={`chip ${
                formData.currentCarriers.includes(carrier) ? 'chip-selected' : 'chip-unselected'
              }`}
            >
              {carrier}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">Select all that apply</p>
      </div>

      <div className="section-card">
        <h3 className="text-base font-semibold text-navy mb-3" style={{ fontFamily: 'Georgia, serif' }}>
          Other Benefits Currently Offered
        </h3>
        <div className="flex flex-wrap gap-2">
          {OTHER_BENEFIT_OPTIONS.map((benefit) => (
            <button
              key={benefit}
              type="button"
              onClick={() => onChange('otherBenefits', toggleChip(formData.otherBenefits, benefit))}
              className={`chip ${
                formData.otherBenefits.includes(benefit) ? 'chip-selected' : 'chip-unselected'
              }`}
            >
              {benefit}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">Select all that apply</p>
      </div>
    </div>
  )
}
