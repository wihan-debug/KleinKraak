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

Copy and paste this complete HTML code into the EmailJS template editor:

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            background: #f4f4f4;
            padding: 20px;
        }
        .email-container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-family: 'Playfair Display', serif;
            font-size: 2rem;
            color: #4A6741;
            font-weight: 700;
        }
        .promo-box {
            background: linear-gradient(135deg, #4A6741 0%, #7E9F70 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            margin: 30px 0;
        }
        .promo-code {
            font-size: 2rem;
            font-weight: bold;
            letter-spacing: 3px;
            background: rgba(255,255,255,0.2);
            padding: 15px 30px;
            border-radius: 8px;
            display: inline-block;
            margin: 10px 0;
            border: 2px dashed white;
        }
        .benefits {
            background: #f9f8f6;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .benefit-item {
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        .benefit-item:last-child {
            border-bottom: none;
        }
        .cta-button {
            display: inline-block;
            background: #4A6741;
            color: white;
            padding: 15px 40px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            color: #999;
            font-size: 0.875rem;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">KleinKraak</div>
            <p style="color: #666; font-size: 1.1rem;">Welcome to Fresh Goodness! 🌱</p>
        </div>

        <p>Hi {{email}},</p>

        <p>Thank you for subscribing to the KleinKraak newsletter! We're excited to share our fresh cucamelons, exclusive recipes, and special offers with you.</p>

        <div class="promo-box">
            <h2 style="margin: 0 0 10px 0;">Your Welcome Gift 🎁</h2>
            <p style="margin: 10px 0; font-size: 1.1rem;">Get 15% off your first order!</p>
            <div class="promo-code">WELCOME15</div>
            <p style="margin: 10px 0; font-size: 0.9rem; opacity: 0.9;">Use this code at checkout</p>
        </div>

        <h3 style="color: #4A6741;">What You'll Get from Our Newsletter:</h3>
        <div class="benefits">
            <div class="benefit-item">📧 <strong>Weekly Recipes</strong> - Delicious ways to use cucamelons</div>
            <div class="benefit-item">🌾 <strong>Harvest Updates</strong> - First to know when fresh batches arrive</div>
            <div class="benefit-item">🎉 <strong>Exclusive Offers</strong> - Subscriber-only discounts</div>
            <div class="benefit-item">🍴 <strong>Cooking Tips</strong> - How to store, pickle, and serve</div>
        </div>

        <div style="text-align: center;">
            <a href="https://wihan-debug.github.io/KleinKraak" class="cta-button">Shop Now & Save 15%</a>
        </div>

        <p style="margin-top: 30px;">We can't wait for you to try our cucamelons! Whether you prefer them fresh and crunchy or pickled to perfection, we've got you covered.</p>

        <p>Happy snacking!<br>
        <strong>The KleinKraak Team</strong></p>

        <div class="footer">
            <p><strong>KleinKraak</strong><br>
            39 Jimpro Road, Elandsfontein, Gauteng<br>
            📧 kleinkraak@gmail.com | 📱 071 479 6079</p>
            <p style="margin-top: 15px; font-size: 0.75rem;">
                You're receiving this because you subscribed to our newsletter.<br>
                Want to unsubscribe? Reply with "unsubscribe"
            </p>
        </div>
    </div>
</body>
</html>
```

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
