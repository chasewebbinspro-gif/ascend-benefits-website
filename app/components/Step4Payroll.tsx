'use client'

import { FormData } from '../types'

const PAYROLL_PROVIDERS = [
  'Gusto', 'ADP', 'Paychex', 'QuickBooks', 'Paylocity',
  'Paycom', 'Rippling', 'Square Payroll', 'In-House', 'Other',
]

const PAY_FREQUENCIES = [
  'Weekly',
  'Bi-weekly',
  'Semi-monthly (2x/month)',
  'Monthly',
]

const PAY_TYPES = ['Salary', 'Hourly', 'Both']

interface Props {
  formData: FormData
  onChange: (field: keyof FormData, value: string) => void
  errors: Record<string, string>
}

export default function Step4Payroll({ formData, onChange, errors }: Props) {
  const showSalary = formData.employeePayType === 'Salary' || formData.employeePayType === 'Both'
  const showHourly = formData.employeePayType === 'Hourly' || formData.employeePayType === 'Both'

  return (
    <div>
      <h2 className="step-header">Payroll Information</h2>
      <p className="step-subheader">Understanding your payroll setup helps us integrate benefits seamlessly.</p>

      <div className="section-card">
        <h3 className="text-base font-semibold text-navy mb-3" style={{ fontFamily: 'Georgia, serif' }}>
          Payroll Provider <span className="required-star">*</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {PAYROLL_PROVIDERS.map((provider) => (
            <button
              key={provider}
              type="button"
              onClick={() => {
                onChange('payrollProvider', provider)
                if (provider !== 'Other') onChange('payrollProviderOther', '')
              }}
              className={`chip ${
                formData.payrollProvider === provider ? 'chip-selected' : 'chip-unselected'
              }`}
            >
              {provider}
            </button>
          ))}
        </div>
        {errors.payrollProvider && <p className="error-text mt-2">{errors.payrollProvider}</p>}

        {formData.payrollProvider === 'Other' && (
          <div className="mt-3">
            <label className="form-label">Please specify</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter your payroll provider"
              value={formData.payrollProviderOther}
              onChange={(e) => onChange('payrollProviderOther', e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="section-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">
              Pay Frequency <span className="required-star">*</span>
            </label>
            <select
              className="form-select"
              value={formData.payFrequency}
              onChange={(e) => onChange('payFrequency', e.target.value)}
            >
              <option value="">Select frequency</option>
              {PAY_FREQUENCIES.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            {errors.payFrequency && <p className="error-text">{errors.payFrequency}</p>}
          </div>

          <div>
            <label className="form-label">
              Employee Pay Type <span className="required-star">*</span>
            </label>
            <select
              className="form-select"
              value={formData.employeePayType}
              onChange={(e) => onChange('employeePayType', e.target.value)}
            >
              <option value="">Select type</option>
              {PAY_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {errors.employeePayType && <p className="error-text">{errors.employeePayType}</p>}
          </div>

          {showSalary && (
            <div>
              <label className="form-label">Average Annual Salary</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                <input
                  type="number"
                  className="form-input pl-7"
                  placeholder="e.g. 55000"
                  min="0"
                  value={formData.salaryAmount}
                  onChange={(e) => onChange('salaryAmount', e.target.value)}
                />
              </div>
            </div>
          )}

          {showHourly && (
            <div>
              <label className="form-label">Average Hourly Rate</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                <input
                  type="number"
                  className="form-input pl-7"
                  placeholder="e.g. 18.50"
                  min="0"
                  step="0.01"
                  value={formData.hourlyRate}
                  onChange={(e) => onChange('hourlyRate', e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="md:col-span-2">
            <label className="form-label">Payroll Contact Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Who manages payroll?"
              value={formData.payrollContactName}
              onChange={(e) => onChange('payrollContactName', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
