'use client'

import { useState } from 'react'
import { FormData, EmployeeRow, initialFormData } from './types'
import ProgressBar from './components/ProgressBar'
import Step1CompanyInfo from './components/Step1CompanyInfo'
import Step2OwnerContact from './components/Step2OwnerContact'
import Step3Benefits from './components/Step3Benefits'
import Step4Payroll from './components/Step4Payroll'
import Step5Census from './components/Step5Census'
import Step6Goals from './components/Step6Goals'
import Confirmation from './components/Confirmation'

const TOTAL_STEPS = 6

function validateStep(step: number, data: FormData): Record<string, string> {
  const errs: Record<string, string> = {}

  if (step === 1) {
    if (!data.legalName.trim()) errs.legalName = 'Legal name is required'
    if (!data.streetAddress.trim()) errs.streetAddress = 'Address is required'
    if (!data.city.trim()) errs.city = 'City is required'
    if (!data.state) errs.state = 'State is required'
    if (!data.zip.trim()) errs.zip = 'ZIP code is required'
    if (!data.industry) errs.industry = 'Industry is required'
    if (!data.totalW2Employees) errs.totalW2Employees = 'Employee count is required'
    if (!data.federalEIN.trim()) errs.federalEIN = 'Federal EIN is required'
    if (!data.businessPhone.trim()) errs.businessPhone = 'Business phone is required'
  }

  if (step === 2) {
    if (!data.ownerFirstName.trim()) errs.ownerFirstName = 'First name is required'
    if (!data.ownerLastName.trim()) errs.ownerLastName = 'Last name is required'
    if (!data.ownerEmail.trim()) errs.ownerEmail = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.ownerEmail))
      errs.ownerEmail = 'Enter a valid email address'
  }

  if (step === 3) {
    if (!data.hasHealthInsurance) errs.hasHealthInsurance = 'Please answer this field'
  }

  if (step === 4) {
    if (!data.payrollProvider) errs.payrollProvider = 'Please select a payroll provider'
    if (!data.payFrequency) errs.payFrequency = 'Pay frequency is required'
    if (!data.employeePayType) errs.employeePayType = 'Pay type is required'
  }

  if (step === 6) {
    if (data.priorities.length === 0) errs.priorities = 'Please select at least one priority'
  }

  return errs
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleChange = (field: keyof FormData, value: string | string[] | EmployeeRow[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field as string]
      return next
    })
  }

  const handleNext = () => {
    const stepErrors = validateStep(currentStep, formData)
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setErrors({})
    setCurrentStep((s) => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = () => {
    setErrors({})
    setCurrentStep((s) => s - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    const stepErrors = validateStep(currentStep, formData)
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return
    }

    setSubmitting(true)
    setSubmitError('')

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Submission failed. Please try again.')
      }

      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const stepProps = { formData, onChange: handleChange, errors }

  return (
    <div className="min-h-screen" style={{ background: '#f0f2f7' }}>
      {/* Header */}
      <header
        className="w-full py-4 px-6 shadow-sm"
        style={{ backgroundColor: '#0A1F44' }}
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1
              className="text-white text-xl font-bold leading-tight"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Ascend Benefits Consulting Group
            </h1>
            <p className="text-xs mt-0.5" style={{ color: '#C9A84C' }}>
              Smarter Benefits. Stronger Businesses.
            </p>
          </div>
          {!submitted && (
            <div className="text-right">
              <span className="text-xs text-blue-200">Step {currentStep} of {TOTAL_STEPS}</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {submitted ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-10">
            <Confirmation formData={formData} />
          </div>
        ) : (
          <>
            <ProgressBar currentStep={currentStep} />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
              {currentStep === 1 && <Step1CompanyInfo {...stepProps} />}
              {currentStep === 2 && <Step2OwnerContact {...stepProps} />}
              {currentStep === 3 && <Step3Benefits {...stepProps} />}
              {currentStep === 4 && <Step4Payroll {...stepProps} />}
              {currentStep === 5 && <Step5Census {...stepProps} />}
              {currentStep === 6 && <Step6Goals {...stepProps} />}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ← Back
                </button>

                <div className="flex items-center gap-4">
                  {submitError && (
                    <p className="text-red-500 text-sm max-w-xs text-right">{submitError}</p>
                  )}
                  {currentStep < TOTAL_STEPS ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="btn-primary"
                    >
                      Continue →
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="btn-gold flex items-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Submitting…
                        </>
                      ) : (
                        'Submit Application'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Footer note */}
            <p className="text-center text-xs text-gray-400 mt-4">
              Your information is secure and will only be used to prepare your benefits analysis.
            </p>
          </>
        )}
      </main>
    </div>
  )
}
