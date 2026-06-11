export interface EmployeeRow {
  firstName: string
  lastName: string
  dob: string
  gender: string
  state: string
  ftPt: string
  dependents: string
}

export interface FormData {
  // Step 1: Company Info
  legalName: string
  dba: string
  streetAddress: string
  city: string
  state: string
  zip: string
  industry: string
  totalW2Employees: string
  federalEIN: string
  businessPhone: string
  sidCode: string

  // Step 2: Owner/HR Contact
  ownerFirstName: string
  ownerLastName: string
  ownerTitle: string
  ownerPhone: string
  ownerEmail: string
  hrName: string
  hrEmail: string
  preferredContact: string

  // Step 3: Current Benefits & Carriers
  hasHealthInsurance: string
  currentCarriers: string[]
  monthlyEmployerPremium: string
  planRenewalMonth: string
  otherBenefits: string[]

  // Step 4: Payroll Info
  payrollProvider: string
  payrollProviderOther: string
  payFrequency: string
  employeePayType: string
  salaryAmount: string
  hourlyRate: string
  payrollContactName: string

  // Step 5: Employee Census
  employees: EmployeeRow[]
  fullTimeCount: string
  partTimeCount: string
  censusFileBase64: string
  censusFileName: string

  // Step 6: Goals & Pain Points
  priorities: string[]
  biggestFrustration: string
  anythingElse: string
  howHeardAboutUs: string
  bestTimeToConnect: string
}

export const initialFormData: FormData = {
  legalName: '',
  dba: '',
  streetAddress: '',
  city: '',
  state: '',
  zip: '',
  industry: '',
  totalW2Employees: '',
  federalEIN: '',
  businessPhone: '',
  sidCode: '',

  ownerFirstName: '',
  ownerLastName: '',
  ownerTitle: '',
  ownerPhone: '',
  ownerEmail: '',
  hrName: '',
  hrEmail: '',
  preferredContact: '',

  hasHealthInsurance: '',
  currentCarriers: [],
  monthlyEmployerPremium: '',
  planRenewalMonth: '',
  otherBenefits: [],

  payrollProvider: '',
  payrollProviderOther: '',
  payFrequency: '',
  employeePayType: '',
  salaryAmount: '',
  hourlyRate: '',
  payrollContactName: '',

  employees: [
    { firstName: '', lastName: '', dob: '', gender: '', state: '', ftPt: '', dependents: '' },
  ],
  fullTimeCount: '',
  partTimeCount: '',
  censusFileBase64: '',
  censusFileName: '',

  priorities: [],
  biggestFrustration: '',
  anythingElse: '',
  howHeardAboutUs: '',
  bestTimeToConnect: '',
}
