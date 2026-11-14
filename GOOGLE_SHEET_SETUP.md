# 📊 AG POWER Solar — Google Sheet & Lead Automation Setup Guide

Connect your Google Sheet to the live AG POWER Solar website (`https://ag-power-solar.vercel.app`) in **under 2 minutes** to automatically capture every customer enquiry in real-time.

---

## Step 1: Create Your Google Sheet

1. Open [Google Sheets](https://sheets.google.com) and create a new sheet (e.g., named **"AG POWER Solar Leads"**).
2. Rename the active tab at the bottom to **`Leads`**.
3. In **Row 1**, enter the official 13 column headers:
   * **A1:** `Enquiry ID`
   * **B1:** `Timestamp (IST)`
   * **C1:** `Name`
   * **D1:** `Phone`
   * **E1:** `Email`
   * **F1:** `Category` *(Residential / Commercial / Society)*
   * **G1:** `Service / Panel`
   * **H1:** `City`
   * **I1:** `Monthly Bill`
   * **J1:** `Source Page`
   * **K1:** `Enquiry Type` *(Contact / Calculator / Consultation)*
   * **L1:** `Message`
   * **M1:** `Status` *(New / Contacted / Qualified / Closed)*

---

## Step 2: Add the Google Apps Script Webhook

1. In your Google Sheet menu bar, click **Extensions** → **Apps Script**.
2. Erase any existing boilerplate code in `Code.gs` and paste the following script:

```javascript
/**
 * AG POWER Solar Lead Capture Webhook (Google Apps Script)
 * Automatically appends solar enquiries into this Google Sheet.
 *
 * 13 Column Headers (Row 1):
 * A: Enquiry ID | B: Timestamp (IST) | C: Name | D: Phone | E: Email |
 * F: Category | G: Service | H: City | I: Monthly Bill | J: Source Page |
 * K: Enquiry Type | L: Message | M: Status
 */
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Leads") || SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }

    // Sanitize string to prevent formula injection
    function sanitize(val) {
      if (val === null || val === undefined) return '';
      var s = String(val).trim();
      if (/^[=+\-@\t\r]/.test(s)) {
        return "'" + s;
      }
      return s;
    }

    var timestamp = data.timestamp || Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm:ss a 'IST'");

    sheet.appendRow([
      sanitize(data.enquiryId || 'lead_' + new Date().getTime()),
      timestamp,
      sanitize(data.name),
      sanitize(data.phone),
      sanitize(data.email),
      sanitize(data.category || 'General'),
      sanitize(data.service || 'Solar Installation'),
      sanitize(data.city),
      sanitize(data.monthlyBill),
      sanitize(data.sourcePage || '/'),
      sanitize(data.enquiryType || 'Contact'),
      sanitize(data.message),
      sanitize(data.status || 'New')
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "AG POWER lead recorded successfully" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click **Save** (`Ctrl + S`).

---

## Step 3: Deploy as Web App

1. Click **Deploy** → **New deployment**.
2. Select type: **Web app**.
3. Configuration:
   * **Description:** `AG POWER Solar Lead Capture`
   * **Execute as:** `Me` (your Google account)
   * **Who has access:** `Anyone` *(Crucial: allows website serverless backend to post leads)*
4. Click **Deploy**.
5. Grant access when prompted (click *Advanced* → *Go to Untitled project (unsafe)* → *Allow*).
6. Copy the generated **Web App URL** (e.g. `https://script.google.com/macros/s/AKfycb.../exec`).

---

## Step 4: Add to Vercel Environment Variables

In your Vercel Dashboard or via CLI:
```bash
vercel env add GOOGLE_SHEET_WEBHOOK_URL production
# Paste the copied Web App URL
```

---

## ⚡ Telegram Real-Time Notification (Optional)

To receive instant lead pings directly on your phone/team group:
1. Create a bot using `@BotFather` on Telegram and copy the Bot Token.
2. Get your User ID or Group Chat ID via `@userinfobot`.
3. Add to Vercel:
```bash
vercel env add TELEGRAM_BOT_TOKEN production
vercel env add TELEGRAM_CHAT_ID production
```
Every time a customer submits on the calculator, panel consultation, or contact page, a clean alert with customer name, phone, city, bill, and system size will immediately ping your team.
