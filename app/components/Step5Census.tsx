'use client'

import { useRef } from 'react'
import { FormData, EmployeeRow } from '../types'

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
]

interface Props {
  formData: FormData
  onChange: (field: keyof FormData, value: string | EmployeeRow[]) => void
  errors: Record<string, string>
}

const emptyRow = (): EmployeeRow => ({
  firstName: '', lastName: '', dob: '', gender: '', state: '', ftPt: '', dependents: '',
})

export default function Step5Census({ formData, onChange, errors }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  const updateRow = (index: number, field: keyof EmployeeRow, value: string) => {
    const updated = formData.employees.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    )
    onChange('employees', updated)
  }

  const addRow = () => {
    onChange('employees', [...formData.employees, emptyRow()])
  }

  const removeRow = (index: number) => {
    if (formData.employees.length === 1) return
    onChange('employees', formData.employees.filter((_, i) => i !== index))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      onChange('censusFileBase64', (ev.target?.result as string) ?? '')
      onChange('censusFileName', file.name)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <h2 className="step-header">Employee Census</h2>
      <p className="step-subheader">
        Enter employee information manually or upload a spreadsheet — either works.
      </p>

      {/* File Upload */}
      <div className="section-card">
        <h3 className="text-base font-semibold text-navy mb-2" style={{ fontFamily: 'Georgia, serif' }}>
          Upload Census File
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          Accepted formats: .xlsx, .csv — Include: Name, DOB, Gender, State, FT/PT, Dependents
        </p>
        <div
          className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-gold transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          {formData.censusFileName ? (
            <div className="flex items-center justify-center gap-2 text-navy">
              <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">{formData.censusFileName}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onChange('censusFileBase64', '')
                  onChange('censusFileName', '')
                  if (fileRef.current) fileRef.current.value = ''
                }}
                className="text-gray-400 hover:text-red-500 ml-2 text-xs underline"
              >
                Remove
              </button>
            </div>
          ) : (
            <>
              <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gold">Click to upload</span> or drag & drop
              </p>
              <p className="text-xs text-gray-400 mt-1">.xlsx or .csv</p>
            </>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.csv"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Manual Entry Table */}
      <div className="section-card overflow-x-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-navy" style={{ fontFamily: 'Georgia, serif' }}>
            Employee Roster
          </h3>
          <p className="text-xs text-gray-400">Or enter manually below</p>
        </div>

        <div className="min-w-[700px]">
          {/* Header */}
          <div className="grid grid-cols-7 gap-1.5 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide px-1">
            <div>First Name</div>
            <div>Last Name</div>
            <div>DOB</div>
            <div>Gender</div>
            <div>State</div>
            <div>FT/PT</div>
            <div>Dependents</div>
          </div>

          {formData.employees.map((row, i) => (
            <div key={i} className="grid grid-cols-7 gap-1.5 mb-1.5 items-center group">
              <input
                type="text"
                className="form-input text-xs py-1.5"
                placeholder="First"
                value={row.firstName}
                onChange={(e) => updateRow(i, 'firstName', e.target.value)}
              />
              <input
                type="text"
                className="form-input text-xs py-1.5"
                placeholder="Last"
                value={row.lastName}
                onChange={(e) => updateRow(i, 'lastName', e.target.value)}
              />
              <input
                type="date"
                className="form-input text-xs py-1.5"
                value={row.dob}
                onChange={(e) => updateRow(i, 'dob', e.target.value)}
              />
              <select
                className="form-select text-xs py-1.5"
                value={row.gender}
                onChange={(e) => updateRow(i, 'gender', e.target.value)}
              >
                <option value="">—</option>
                <option value="M">M</option>
                <option value="F">F</option>
                <option value="Other">Other</option>
              </select>
              <select
                className="form-select text-xs py-1.5"
                value={row.state}
                onChange={(e) => updateRow(i, 'state', e.target.value)}
              >
                <option value="">—</option>
                {US_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <select
                className="form-select text-xs py-1.5"
                value={row.ftPt}
                onChange={(e) => updateRow(i, 'ftPt', e.target.value)}
              >
                <option value="">—</option>
                <option value="FT">FT</option>
                <option value="PT">PT</option>
              </select>
              <div className="flex gap-1 items-center">
                <input
                  type="number"
                  className="form-input text-xs py-1.5 w-full"
                  placeholder="0"
                  min="0"
                  value={row.dependents}
                  onChange={(e) => updateRow(i, 'dependents', e.target.value)}
                />
                {formData.employees.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRow(i)}
                    className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                    title="Remove row"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addRow}
          className="mt-3 flex items-center gap-1.5 text-sm text-gold font-semibold hover:text-navy transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Employee
        </button>
      </div>

      {/* Totals */}
      <div className="section-card">
        <h3 className="text-base font-semibold text-navy mb-3" style={{ fontFamily: 'Georgia, serif' }}>
          Headcount Summary
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">Full-Time Employees</label>
            <input
              type="number"
              className="form-input"
              placeholder="0"
              min="0"
              value={formData.fullTimeCount}
              onChange={(e) => onChange('fullTimeCount', e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Part-Time Employees</label>
            <input
              type="number"
              className="form-input"
              placeholder="0"
              min="0"
              value={formData.partTimeCount}
              onChange={(e) => onChange('partTimeCount', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
