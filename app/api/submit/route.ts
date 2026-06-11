import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

function formatList(items: string[]): string {
  return items.length > 0 ? items.join(', ') : 'None selected'
}

function row(label: string, value: string | undefined): string {
  return `
    <tr>
      <td style="padding:8px 12px;background:#f8f9fb;font-weight:600;color:#0A1F44;width:35%;border-bottom:1px solid #e5e7eb;font-family:'Trebuchet MS',sans-serif;font-size:13px;">${label}</td>
      <td style="padding:8px 12px;color:#374151;border-bottom:1px solid #e5e7eb;font-family:'Trebuchet MS',sans-serif;font-size:13px;">${value || '—'}</td>
    </tr>`
}

function section(title: string, rows: string): string {
  return `
    <div style="margin-bottom:28px;">
      <div style="background:#0A1F44;padding:10px 16px;border-radius:6px 6px 0 0;">
        <h2 style="margin:0;color:#C9A84C;font-size:15px;font-family:Georgia,serif;letter-spacing:0.3px;">${title}</h2>
      </div>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 6px 6px;overflow:hidden;">
        <tbody>${rows}</tbody>
      </table>
    </div>`
}

function buildEmailHtml(data: Record<string, unknown>): string {
  const s1 = section('1. Company Information', [
    row('Legal Business Name', data.legalName as string),
    row('DBA', data.dba as string),
    row('Street Address', data.streetAddress as string),
    row('City / State / ZIP', `${data.city}, ${data.state} ${data.zip}`),
    row('Industry', data.industry as string),
    row('Total W-2 Employees', data.totalW2Employees as string),
    row('Federal EIN', data.federalEIN as string),
    row('Business Phone', data.businessPhone as string),
    row('SID Code', data.sidCode as string),
  ].join(''))

  const s2 = section('2. Owner / HR Contact', [
    row('Primary Contact', `${data.ownerFirstName} ${data.ownerLastName}`),
    row('Title', data.ownerTitle as string),
    row('Direct Phone', data.ownerPhone as string),
    row('Email', data.ownerEmail as string),
    row('HR Admin Name', data.hrName as string),
    row('HR Admin Email', data.hrEmail as string),
    row('Preferred Contact Method', data.preferredContact as string),
  ].join(''))

  const s3 = section('3. Current Benefits & Carriers', [
    row('Has Health Insurance', data.hasHealthInsurance as string),
    row('Current Carriers', formatList(data.currentCarriers as string[])),
    row('Monthly Employer Premium', data.monthlyEmployerPremium ? `$${data.monthlyEmployerPremium}` : '—'),
    row('Plan Renewal Month', data.planRenewalMonth as string),
    row('Other Benefits', formatList(data.otherBenefits as string[])),
  ].join(''))

  const payrollName = data.payrollProvider === 'Other'
    ? `Other: ${data.payrollProviderOther}`
    : data.payrollProvider as string

  const payTypeDetails = (() => {
    const t = data.employeePayType as string
    if (t === 'Salary') return `Salary — Avg: $${data.salaryAmount || 'N/A'}`
    if (t === 'Hourly') return `Hourly — Avg: $${data.hourlyRate || 'N/A'}/hr`
    if (t === 'Both') return `Both — Salary: $${data.salaryAmount || 'N/A'} / Hourly: $${data.hourlyRate || 'N/A'}/hr`
    return t
  })()

  const s4 = section('4. Payroll Information', [
    row('Payroll Provider', payrollName),
    row('Pay Frequency', data.payFrequency as string),
    row('Employee Pay Type', payTypeDetails),
    row('Payroll Contact', data.payrollContactName as string),
  ].join(''))

  const employees = data.employees as Array<Record<string, string>>
  const employeeRows = employees
    .filter((e) => e.firstName || e.lastName)
    .map((e, i) =>
      `<tr style="background:${i % 2 === 0 ? '#fff' : '#f8f9fb'}">
        <td style="padding:6px 10px;font-size:12px;border-bottom:1px solid #e5e7eb;font-family:'Trebuchet MS',sans-serif;">${e.firstName} ${e.lastName}</td>
        <td style="padding:6px 10px;font-size:12px;border-bottom:1px solid #e5e7eb;font-family:'Trebuchet MS',sans-serif;">${e.dob || '—'}</td>
        <td style="padding:6px 10px;font-size:12px;border-bottom:1px solid #e5e7eb;font-family:'Trebuchet MS',sans-serif;">${e.gender || '—'}</td>
        <td style="padding:6px 10px;font-size:12px;border-bottom:1px solid #e5e7eb;font-family:'Trebuchet MS',sans-serif;">${e.state || '—'}</td>
        <td style="padding:6px 10px;font-size:12px;border-bottom:1px solid #e5e7eb;font-family:'Trebuchet MS',sans-serif;">${e.ftPt || '—'}</td>
        <td style="padding:6px 10px;font-size:12px;border-bottom:1px solid #e5e7eb;font-family:'Trebuchet MS',sans-serif;">${e.dependents || '0'}</td>
      </tr>`
    )
    .join('')

  const censusTable = employees.filter((e) => e.firstName || e.lastName).length > 0
    ? `<div style="margin-bottom:28px;">
        <div style="background:#0A1F44;padding:10px 16px;border-radius:6px 6px 0 0;">
          <h2 style="margin:0;color:#C9A84C;font-size:15px;font-family:Georgia,serif;">5. Employee Census</h2>
        </div>
        <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-top:none;">
          <thead>
            <tr style="background:#f0f2f7;">
              <th style="padding:8px 10px;font-size:12px;text-align:left;font-family:'Trebuchet MS',sans-serif;color:#0A1F44;border-bottom:2px solid #e5e7eb;">Name</th>
              <th style="padding:8px 10px;font-size:12px;text-align:left;font-family:'Trebuchet MS',sans-serif;color:#0A1F44;border-bottom:2px solid #e5e7eb;">DOB</th>
              <th style="padding:8px 10px;font-size:12px;text-align:left;font-family:'Trebuchet MS',sans-serif;color:#0A1F44;border-bottom:2px solid #e5e7eb;">Gender</th>
              <th style="padding:8px 10px;font-size:12px;text-align:left;font-family:'Trebuchet MS',sans-serif;color:#0A1F44;border-bottom:2px solid #e5e7eb;">State</th>
              <th style="padding:8px 10px;font-size:12px;text-align:left;font-family:'Trebuchet MS',sans-serif;color:#0A1F44;border-bottom:2px solid #e5e7eb;">FT/PT</th>
              <th style="padding:8px 10px;font-size:12px;text-align:left;font-family:'Trebuchet MS',sans-serif;color:#0A1F44;border-bottom:2px solid #e5e7eb;">Deps.</th>
            </tr>
          </thead>
          <tbody>${employeeRows}</tbody>
        </table>
        <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-top:none;">
          <tbody>
            ${row('Full-Time Count', data.fullTimeCount as string)}
            ${row('Part-Time Count', data.partTimeCount as string)}
            ${data.censusFileName ? row('Census File Uploaded', data.censusFileName as string) : ''}
          </tbody>
        </table>
      </div>`
    : section('5. Employee Census', [
        row('Full-Time Count', data.fullTimeCount as string),
        row('Part-Time Count', data.partTimeCount as string),
        data.censusFileName ? row('Census File Uploaded', data.censusFileName as string) : '',
      ].join(''))

  const s6 = section('6. Goals & Pain Points', [
    row('Top Priorities', formatList(data.priorities as string[])),
    row('Biggest Frustration', data.biggestFrustration as string),
    row('Anything Else', data.anythingElse as string),
    row('How Heard About Us', data.howHeardAboutUs as string),
    row('Best Time to Connect', data.bestTimeToConnect as string),
  ].join(''))

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f0f2f7;font-family:'Trebuchet MS',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f2f7;padding:32px 16px;">
    <tr><td align="center">
      <table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#0A1F44;padding:28px 32px;border-radius:10px 10px 0 0;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-family:Georgia,serif;letter-spacing:0.5px;">
              Ascend Benefits Consulting Group
            </h1>
            <p style="margin:6px 0 0;color:#C9A84C;font-size:13px;font-family:'Trebuchet MS',sans-serif;">
              Smarter Benefits. Stronger Businesses.
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:32px 32px 8px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">
            <div style="background:#fffbf0;border-left:4px solid #C9A84C;padding:12px 16px;border-radius:0 6px 6px 0;margin-bottom:28px;">
              <p style="margin:0;font-size:14px;color:#0A1F44;font-family:'Trebuchet MS',sans-serif;">
                <strong>New client submission received</strong> — ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            ${s1}${s2}${s3}${s4}${censusTable}${s6}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#0A1F44;padding:20px 32px;border-radius:0 0 10px 10px;text-align:center;">
            <p style="margin:0;color:#8fa8c8;font-size:12px;font-family:'Trebuchet MS',sans-serif;">
              This email was automatically generated by the Ascend Benefits client onboarding system.<br/>
              Please do not reply directly to this email.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function POST(request: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const data = await request.json()

    const companyName = data.legalName || 'Unknown Company'
    const htmlContent = buildEmailHtml(data)

    // Build attachments — include census file if uploaded
    const attachments: Array<{ filename: string; content: string }> = []
    if (data.censusFileBase64 && data.censusFileName) {
      const base64Data = (data.censusFileBase64 as string).split(',')[1]
      if (base64Data) {
        attachments.push({
          filename: data.censusFileName as string,
          content: base64Data,
        })
      }
    }

    // Send email via Resend
    const emailResult = await resend.emails.send({
      from: 'noreply@ascendbenefitscg.com',
      to: ['info@ascendbenefitscg.com'],
      subject: `New Client Submission: ${companyName}`,
      html: htmlContent,
      ...(attachments.length > 0 && { attachments }),
    })

    if (emailResult.error) {
      console.error('Resend error:', emailResult.error)
      // Don't fail the whole request over email — still save the file
    }

    // Save submission JSON to /submissions folder
    try {
      const submissionsDir = path.join(process.cwd(), 'submissions')
      await mkdir(submissionsDir, { recursive: true })
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const filename = `${timestamp}_${companyName.replace(/[^a-zA-Z0-9]/g, '_')}.json`
      const filepath = path.join(submissionsDir, filename)
      const payload = {
        submittedAt: new Date().toISOString(),
        formData: { ...data, censusFileBase64: data.censusFileBase64 ? '[file data omitted]' : '' },
      }
      await writeFile(filepath, JSON.stringify(payload, null, 2), 'utf-8')
    } catch (fileErr) {
      console.error('File save error (non-fatal):', fileErr)
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error('Submit error:', err)
    return NextResponse.json(
      { error: 'Failed to process submission. Please try again.' },
      { status: 500 }
    )
  }
}
