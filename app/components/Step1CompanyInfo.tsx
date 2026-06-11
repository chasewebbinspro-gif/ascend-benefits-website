'use client'

import { FormData } from '../types'

const INDUSTRIES = [
  'Healthcare',
  'Technology',
  'Retail',
  'Manufacturing',
  'Construction',
  'Finance & Banking',
  'Education',
  'Hospitality & Food Service',
  'Transportation & Logistics',
  'Professional Services',
  'Real Estate',
  'Non-Profit',
  'Government',
  'Agriculture',
  'Energy & Utilities',
  'Other',
]

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
]

interface Props {
  formData: FormData
  onChange: (field: keyof FormData, value: string) => void
  errors: Record<string, string>
}

export default function Step1CompanyInfo({ formData, onChange, errors }: Props) {
  return (
    <div>
      <h2 className="step-header">Company Information</h2>
      <p className="step-subheader">Tell us about your business so we can tailor our recommendations.</p>

      <div className="section-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="form-label">
              Legal Business Name <span className="required-star">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Acme Corporation, LLC"
              value={formData.legalName}
              onChange={(e) => onChange('legalName', e.target.value)}
            />
            {errors.legalName && <p className="error-text">{errors.legalName}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="form-label">DBA (Doing Business As)</label>
            <input
              type="text"
              className="form-input"
              placeholder="If different from legal name"
              value={formData.dba}
              onChange={(e) => onChange('dba', e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="form-label">
              Street Address <span className="required-star">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="123 Main Street"
              value={formData.streetAddress}
              onChange={(e) => onChange('streetAddress', e.target.value)}
            />
            {errors.streetAddress && <p className="error-text">{errors.streetAddress}</p>}
          </div>

          <div>
            <label className="form-label">
              City <span className="required-star">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="City"
              value={formData.city}
              onChange={(e) => onChange('city', e.target.value)}
            />
            {errors.city && <p className="error-text">{errors.city}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">
                State <span className="required-star">*</span>
              </label>
              <select
                className="form-select"
                value={formData.state}
                onChange={(e) => onChange('state', e.target.value)}
              >
                <option value="">State</option>
                {US_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.state && <p className="error-text">{errors.state}</p>}
            </div>
            <div>
              <label className="form-label">
                ZIP <span className="required-star">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="12345"
                maxLength={10}
                value={formData.zip}
                onChange={(e) => onChange('zip', e.target.value)}
              />
              {errors.zip && <p className="error-text">{errors.zip}</p>}
            </div>
          </div>

          <div>
            <label className="form-label">
              Industry <span className="required-star">*</span>
            </label>
            <select
              className="form-select"
              value={formData.industry}
              onChange={(e) => onChange('industry', e.target.value)}
            >
              <option value="">Select industry</option>
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
            {errors.industry && <p className="error-text">{errors.industry}</p>}
          </div>

          <div>
            <label className="form-label">
              Total W-2 Employees <span className="required-star">*</span>
            </label>
            <input
              type="number"
              className="form-input"
              placeholder="e.g. 25"
              min="1"
              value={formData.totalW2Employees}
              onChange={(e) => onChange('totalW2Employees', e.target.value)}
            />
            {errors.totalW2Employees && <p className="error-text">{errors.totalW2Employees}</p>}
          </div>

          <div>
            <label className="form-label">
              Federal EIN <span className="required-star">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="XX-XXXXXXX"
              value={formData.federalEIN}
              onChange={(e) => onChange('federalEIN', e.target.value)}
            />
            {errors.federalEIN && <p className="error-text">{errors.federalEIN}</p>}
          </div>

          <div>
            <label className="form-label">
              Business Phone <span className="required-star">*</span>
            </label>
            <input
              type="tel"
              className="form-input"
              placeholder="(555) 000-0000"
              value={formData.businessPhone}
              onChange={(e) => onChange('businessPhone', e.target.value)}
            />
            {errors.businessPhone && <p className="error-text">{errors.businessPhone}</p>}
          </div>

          <div>
            <label className="form-label">SID Code</label>
            <input
              type="text"
              className="form-input"
              placeholder="If applicable"
              value={formData.sidCode}
              onChange={(e) => onChange('sidCode', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
