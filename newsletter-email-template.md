# Newsletter Welcome Email Template

## Setup Instructions

### 1. Create Template in EmailJS

1. Go to https://dashboard.emailjs.com
2. Navigate to **Email Templates**
3. Click **Create New Template**
4. Set Template ID: `template_newsletter_welcome`

### 2. Template Configuration

**Subject Line:**
```
Welcome to KleinKraak! Here's 15% Off 🎉
```

**Template Variables:**
- `{{to_email}}` - Customer's email address
- `{{email}}` - Customer's email (backup)

### 3. HTML Email Body

Copy the complete HTML template provided above into the template editor.

### 4. Test the Template

Send a test email to yourself to verify:
- ✅ WELCOME15 code displays prominently
- ✅ Formatting looks good on mobile & desktop
- ✅ Links work correctly
- ✅ Images/icons render properly

## How It Works

**Customer Flow:**
1. Customer enters email on website newsletter form
2. Clicks "Subscribe"
3. Receives 2 emails instantly:
   - **Customer**: Welcome email with WELCOME15 code
   - **You (Admin)**: Notification of new subscriber

**Email Content Highlights:**
- Large WELCOME15 promo code in green box
- 15% off first order offer
- What they'll get (weekly recipes, harvest updates, etc.)
- Shop Now CTA button
- Your contact info in footer

## Promo Code Usage

**WELCOME15:**
- 15% discount on first order
- One-time use per customer email
- Perfect for newsletter subscribers
- Creates instant conversion incentive

**FRESH10:**
- 10% discount (existing code from banner)
- Also one-time use
- For general first-time customers

## Customization Tips

**Color Scheme:**
- Primary Green: `#4A6741`
- Light Green: `#7E9F70`
- Matches your website branding

**Copy Changes:**
Feel free to modify:
- Subject line
- Welcome message tone
- Benefits list
- CTA button text

**Images:**
Consider adding:
- Your logo at top
- Product photos
- Farm/harvest photos

## Important Notes

⚠️ **Make sure to:**
1. Set up `template_newsletter_welcome` in EmailJS with exact ID
2. Use your actual website URL in the "Shop Now" button
3. Test with your own email first
4. Update unsubscribe link when you have one

✅ **Already configured:**
- Service ID: `service_newsletter`
- Template sends automatically on signup
- Admin notification included
- Success message updated to mention WELCOME15

## Files Modified

- `scripts/features.js` - Updated newsletter signup to send welcome email with WELCOME15 code
