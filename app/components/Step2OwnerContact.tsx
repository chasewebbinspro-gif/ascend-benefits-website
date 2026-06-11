'use client'

import { FormData } from '../types'

const CONTACT_METHODS = ['Email', 'Phone', 'Text']

interface Props {
  formData: FormData
  onChange: (field: keyof FormData, value: string) => void
  errors: Record<string, string>
}

export default function Step2OwnerContact({ formData, onChange, errors }: Props) {
  return (
    <div>
      <h2 className="step-header">Owner & HR Contact</h2>
      <p className="step-subheader">Who should we be in touch with about your benefits?</p>

      <div className="section-card">
        <h3 className="text-lg font-semibold text-navy mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          Primary Owner / Decision Maker
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">
              First Name <span className="required-star">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="First name"
              value={formData.ownerFirstName}
              onChange={(e) => onChange('ownerFirstName', e.target.value)}
            />
            {errors.ownerFirstName && <p className="error-text">{errors.ownerFirstName}</p>}
          </div>

          <div>
            <label className="form-label">
              Last Name <span className="required-star">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Last name"
              value={formData.ownerLastName}
              onChange={(e) => onChange('ownerLastName', e.target.value)}
            />
            {errors.ownerLastName && <p className="error-text">{errors.ownerLastName}</p>}
          </div>

          <div>
            <label className="form-label">Title / Role</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. CEO, President, Owner"
              value={formData.ownerTitle}
              onChange={(e) => onChange('ownerTitle', e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Direct Phone</label>
            <input
              type="tel"
              className="form-input"
              placeholder="(555) 000-0000"
              value={formData.ownerPhone}
              onChange={(e) => onChange('ownerPhone', e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="form-label">
              Email Address <span className="required-star">*</span>
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="you@company.com"
              value={formData.ownerEmail}
              onChange={(e) => onChange('ownerEmail', e.target.value)}
            />
            {errors.ownerEmail && <p className="error-text">{errors.ownerEmail}</p>}
          </div>
        </div>
      </div>

      <div className="section-card">
        <h3 className="text-lg font-semibold text-navy mb-1" style={{ fontFamily: 'Georgia, serif' }}>
          HR / Benefits Administrator
        </h3>
        <p className="text-xs text-gray-500 mb-4">Leave blank if same as above</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="HR contact name"
              value={formData.hrName}
              onChange={(e) => onChange('hrName', e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="hr@company.com"
              value={formData.hrEmail}
              onChange={(e) => onChange('hrEmail', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="section-card">
        <h3 className="text-lg font-semibold text-navy mb-3" style={{ fontFamily: 'Georgia, serif' }}>
          Preferred Contact Method
        </h3>
        <div className="flex flex-wrap gap-2">
          {CONTACT_METHODS.map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => onChange('preferredContact', method)}
              className={`chip ${
                formData.preferredContact === method ? 'chip-selected' : 'chip-unselected'
              }`}
            >
              {method}
            </button>
          ))}
        </div>
        {errors.preferredContact && <p className="error-text mt-2">{errors.preferredContact}</p>}
      </div>
    </div>
  )
}
