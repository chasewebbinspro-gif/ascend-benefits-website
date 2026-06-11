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

      {/* Contact Card */}
      <div
        className="rounded-xl p-6 max-w-lg mx-auto text-white"
        style={{ background: 'linear-gradient(135deg, #0A1F44 0%, #1a3a6b 100%)' }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">CW</span>
          </div>
          <div className="text-left">
            <p className="font-bold text-base" style={{ fontFamily: 'Georgia, serif' }}>Chase Webb</p>
            <p className="text-gold text-xs">Benefits Consultant</p>
          </div>
        </div>
        <p className="text-sm text-blue-100 mb-3 text-left">
          Questions before we reach out? Feel free to call or text Chase directly:
        </p>
        <a
          href="tel:2513797042"
          className="block text-center bg-gold text-white font-bold text-lg py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          (251) 379-7042
        </a>
      </div>

      <p className="text-xs text-gray-400 mt-6">
        A confirmation email has been sent to{' '}
        <span className="font-medium text-navy">{formData.ownerEmail}</span>
      </p>
    </div>
  )
}
