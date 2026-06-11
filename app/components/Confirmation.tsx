'use client'

import { FormData } from '../types'

interface Props {
  formData: FormData
}

export default function Confirmation({ formData }: Props) {
  return (
    <div className="text-center py-6">
      {/* Success Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <h2
        className="text-3xl font-bold text-navy mb-2"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        You&rsquo;re All Set!
      </h2>
      <p className="text-gray-500 text-base mb-8">
        Thank you for submitting your information. Our team will be in touch shortly.
      </p>

      {/* Summary Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-left max-w-lg mx-auto mb-6">
        <h3
          className="text-lg font-bold text-navy mb-4 border-b border-gray-100 pb-3"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Submission Summary
        </h3>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Company</span>
            <span className="text-navy font-semibold text-right">
              {formData.legalName || '—'}
              {formData.dba && <span className="text-gray-400 ml-1 font-normal">(DBA: {formData.dba})</span>}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Contact</span>
            <span className="text-navy font-semibold">
              {[formData.ownerFirstName, formData.ownerLastName].filter(Boolean).join(' ') || '—'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Email</span>
            <span className="text-navy font-semibold">{formData.ownerEmail || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Phone</span>
            <span className="text-navy font-semibold">{formData.ownerPhone || formData.businessPhone || '—'}</span>
          </div>
          {formData.industry && (
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Industry</span>
              <span className="text-navy font-semibold">{formData.industry}</span>
            </div>
          )}
          {formData.totalW2Employees && (
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Employees</span>
              <span className="text-navy font-semibold">{formData.totalW2Employees} W-2</span>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
