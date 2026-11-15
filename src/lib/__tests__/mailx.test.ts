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

  it("builds a branded confirmation email containing official AG POWER details", () => {
    const email = buildContactConfirmationEmail({
      name: "Alex Rivera",
      email: "alex@example.com",
      subject: "New Solar Installation",
      message: "We need 5kW residential solar rooftop installation.",
    })

    expect(email.subject).toContain("Thank you for contacting AG POWER")
    expect(email.html).toContain("contact@agpower.in")
    expect(email.html).toContain("+91 98765 43210")
    expect(email.html).toContain("Clean Energy. Smarter Living.")

    // Check plaintext version
    expect(email.text).toContain("contact@agpower.in")
    expect(email.text).toContain("Alex Rivera")
  })

  it("includes AG POWER CC recipient by default", () => {
    expect(DEFAULT_CC_RECIPIENTS).toEqual(["contact@agpower.in"])
  })
})
