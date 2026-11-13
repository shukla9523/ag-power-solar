import { describe, expect, it } from "vitest"
import {
  buildContactConfirmationEmail,
  DEFAULT_CC_RECIPIENTS,
  formatIST,
} from "../services/mailx"
import { neutralizeFormula, sheetTarget } from "../services/google-sheets"

describe("MailX & Contact Automation Pipeline", () => {
  it("formats dates into Indian Standard Time (IST)", () => {
    const fixedDate = new Date("2026-11-13T10:00:00.000Z")
    const formatted = formatIST(fixedDate)
    expect(formatted).toContain("IST")
  })

  it("neutralizes potential formula injection characters with single quote", () => {
    expect(neutralizeFormula("=SUM(A1:A10)")).toBe("'=SUM(A1:A10)")
    expect(neutralizeFormula("+919876543210")).toBe("'+919876543210")
    expect(neutralizeFormula("-test")).toBe("'-test")
    expect(neutralizeFormula("@admin")).toBe("'@admin")
    expect(neutralizeFormula("Normal text")).toBe("Normal text")
  })

  it("builds a branded confirmation email containing Google Calendar booking link and ecosystem overview", () => {
    const email = buildContactConfirmationEmail({
      name: "Alex Rivera",
      email: "alex@example.com",
      subject: "New Brand Launch",
      message: "We need video editing and full performance marketing.",
    })

    expect(email.subject).toContain("Thank you for contacting Mommantum")
    expect(email.html).toContain("https://calendar.app.google/TFNjVK79KmTMEgsW6")
    expect(email.html).toContain("10:00 AM")
    expect(email.html).toContain("6:00 PM IST")
    expect(email.html).toContain("ahirkuldeep1709@gmail.com")
    expect(email.html).toContain("sharmasaurabh2604@gmail.com")
    expect(email.html).toContain("kuldeep@mommantum.com")
    expect(email.html).toContain("EDITZ Video Studio")
    expect(email.html).toContain("Blog AI Platform")
    expect(email.html).toContain("Performance Marketing")
    expect(email.html).toContain("AI Agentic Workflows")

    // Check plaintext version
    expect(email.text).toContain("https://calendar.app.google/TFNjVK79KmTMEgsW6")
    expect(email.text).toContain("Alex Rivera")
  })

  it("includes both CC recipients by default", () => {
    expect(DEFAULT_CC_RECIPIENTS).toEqual(["kuldeep@mommantum.com", "sharmasaurabh2604@gmail.com"])
  })
})
