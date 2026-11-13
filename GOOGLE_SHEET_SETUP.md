# 📊 Mommantum Google Sheet & Contact Automation Setup Guide

This guide walks you through connecting your Google Sheet to the Mommantum contact page (`mommantum.com/contact`) in **under 2 minutes**.

---

## Step 1: Create Your Google Sheet

1. Open [Google Sheets](https://sheets.google.com) and create a new sheet (e.g., named **"Mommantum Contact Leads"**).
2. In **Row 1**, enter these column headers:
   * **A1:** `Timestamp (IST)`
   * **B1:** `Name`
   * **C1:** `Email`
   * **D1:** `Subject`
   * **E1:** `Message`

*(Optional extra columns if needed: F1: `Phone`, G1: `Source`)*

---

## Step 2: Add the Google Apps Script Webhook

1. In your Google Sheet menu bar, click **Extensions** → **Apps Script**.
2. Erase any existing boilerplate code in `Code.gs` and paste the following script:

```javascript
/**
 * Mommantum Contact Form Webhook (Google Apps Script)
 * Automatically appends contact form submissions into this Google Sheet.
 *
 * Column Headers (Row 1):
 * A1: Timestamp (IST) | B1: Name | C1: Email | D1: Subject | E1: Message
 */
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }

    // Sanitize string to prevent Google Sheets formula injection (#ERROR!, =SUM, +cmd, etc.)
    function sanitize(val) {
      if (val === null || val === undefined) return '';
      var s = String(val).trim();
      if (/^[=+\-@\t\r]/.test(s)) {
        return "'" + s;
      }
      return s;
    }

    var timestamp = data.timestamp || Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm:ss a 'IST'");
    var name = sanitize(data.name);
    var email = sanitize(data.email);
    var subject = sanitize(data.subject);
    var message = sanitize(data.message);

    // Append new row
    sheet.appendRow([
      timestamp,
      name,
      email,
      subject,
      message
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Lead recorded successfully" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click the **Save** (💾) icon or press `Ctrl + S`.

---

## Step 3: Deploy as a Web App

1. In the top-right corner of Apps Script, click **Deploy** → **New deployment**.
2. Click the gear icon (⚙️) next to "Select type" and choose **Web app**.
3. Configure the settings:
   * **Description:** `Mommantum Contact Webhook`
   * **Execute as:** `Me (your Google account email)`
   * **Who has access:** `Anyone` *(Crucial: must be "Anyone" so the website can post new inquiries)*
4. Click **Deploy**.
5. If Google prompts for permissions:
   * Click **Authorize access**
   * Select your Google account
   * Click **Advanced** (bottom left) → **Go to Untitled project (unsafe)** → **Allow**
6. Copy the generated **Web App URL** (looks like `https://script.google.com/macros/s/AKfycb.../exec`).

---

## Step 4: Share the Web App URL

Send the copied Web App URL to complete the setup. It will be added as:

```env
GOOGLE_SHEET_WEBHOOK_URL="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
```

---

## ⚡ What Runs Automatically on Every Submission:

1. **Google Sheets Real-Time Sync**: A new row is appended with IST timestamp, name, email, subject, and message.
2. **Formula Neutralization**: Strings with special leading characters (`=`, `+`, `-`, `@`) are prefixed with `'` to completely avoid `#ERROR!` formula parse errors.
3. **Automated Branded Confirmation Email via MailX REST API** (`POST https://mailx.rapidchip.in/api/v1/send`):
   * **Sender:** `Mommantum <sales@notify.mommantum.com>`
   * **Recipient:** The submitter's email address
   * **CC:** `kuldeep@mommantum.com`, `sharmasaurabh2604@gmail.com`
   * **Resilience:** If delivery with CC fails (e.g. suppression list error), it automatically retries sending to the primary recipient alone.
4. **Google Calendar Strategy Link**:
   * Direct booking link: `https://calendar.app.google/TFNjVK79KmTMEgsW6`
   * Hours: 10:00 AM – 6:00 PM IST (Mon–Sat)
   * Max 4-day advance booking window with 1-hour buffer between calls and double-booking prevention.
   * Participants on invite: `ahirkuldeep1709@gmail.com`, `sharmasaurabh2604@gmail.com`
5. **Mommantum Service Overview**:
   * **Editz** (Short-form video editing, Reels/TikToks)
   * **Growth Services** (Performance Marketing, AI Agents, SEO/AEO/GEO, Web/App Development)
   * **Blog AI** (Autonomous SEO engine: `https://auto-blog.electroglobal.in/`)
   * **Creative Strategy & CRO**
6. **Direct Support**:
   * `kuldeep@mommantum.com`
   * `sharmasaurabh2604@gmail.com`

