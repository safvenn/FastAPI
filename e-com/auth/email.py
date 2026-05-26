from fastapi_mail import ConnectionConfig,FastMail,MessageSchema
from config import settings

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,

    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_PORT=settings.MAIL_PORT,

    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,

    USE_CREDENTIALS=True
)


#email sending function------------------------------------------

async def send_email_verf(email:str,token:str):
    link = f"http://localhost:5173/verify-email?token={token}"

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
            body {{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                background-color: #0f172a;
                color: #f8fafc;
                margin: 0;
                padding: 0;
                -webkit-font-smoothing: antialiased;
            }}
            .wrapper {{
                background-color: #0f172a;
                width: 100%;
                padding: 40px 0;
            }}
            .container {{
                max-width: 580px;
                margin: 0 auto;
                padding: 40px 30px;
                background-color: #1e293b;
                border-radius: 16px;
                border: 1px solid #334155;
                text-align: center;
            }}
            .logo {{
                font-size: 24px;
                font-weight: 800;
                letter-spacing: -0.04em;
                color: #38bdf8;
                margin-bottom: 24px;
                text-transform: uppercase;
            }}
            .illustration {{
                font-size: 48px;
                margin-bottom: 24px;
                line-height: 1;
            }}
            h1 {{
                color: #ffffff;
                font-size: 24px;
                font-weight: 700;
                margin: 0 0 16px 0;
                letter-spacing: -0.02em;
            }}
            p {{
                color: #94a3b8;
                font-size: 16px;
                line-height: 1.6;
                margin: 0 0 32px 0;
            }}
            .btn-wrapper {{
                margin-bottom: 32px;
            }}
            .btn {{
                display: inline-block;
                background: linear-gradient(135deg, #3b82f6, #6366f1);
                background-color: #3b82f6;
                color: #ffffff !important;
                text-decoration: none;
                padding: 14px 32px;
                border-radius: 10px;
                font-weight: 600;
                font-size: 15px;
                box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
            }}
            .expiry-note {{
                font-size: 13px;
                color: #64748b;
                margin-top: 16px;
            }}
            .footer {{
                margin-top: 40px;
                border-top: 1px solid #334155;
                padding-top: 24px;
            }}
            .footer p {{
                font-size: 13px;
                color: #64748b;
                margin-bottom: 8px;
            }}
        </style>
    </head>
    <body>
        <div class="wrapper">
            <div class="container">
                <div class="logo">Safvenn</div>
                <div class="illustration">✉️</div>
                <h1>Verify your email address</h1>
                <p>Welcome to Safvenn! Tap the button below to confirm your email and complete your registration.</p>
                <div class="btn-wrapper">
                    <a href="{link}" class="btn">Verify Email Address</a>
                </div>
                <p class="expiry-note">This link will expire in 30 minutes for security reasons.</p>
                <div class="footer">
                    <p>If you didn't request this email, you can safely ignore it.</p>
                    <p>&copy; 2026 Safvenn. All rights reserved.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """

    message = MessageSchema(
        subject="Verify Your Email",
        recipients=[email],
        body=html_content,
        subtype="html"
    )
    fm = FastMail(conf)
    await fm.send_message(message)

async def send_otp(email: str, otp: int):
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login Verification - OTP</title>
        <style>
            body {{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                background-color: #0f172a;
                color: #f8fafc;
                margin: 0;
                padding: 0;
                -webkit-font-smoothing: antialiased;
            }}
            .wrapper {{
                background-color: #0f172a;
                width: 100%;
                padding: 40px 0;
            }}
            .container {{
                max-width: 580px;
                margin: 0 auto;
                padding: 40px 30px;
                background-color: #1e293b;
                border-radius: 16px;
                border: 1px solid #334155;
                text-align: center;
            }}
            .logo {{
                font-size: 24px;
                font-weight: 800;
                letter-spacing: -0.04em;
                color: #38bdf8;
                margin-bottom: 24px;
                text-transform: uppercase;
            }}
            .illustration {{
                font-size: 48px;
                margin-bottom: 24px;
                line-height: 1;
            }}
            h1 {{
                color: #ffffff;
                font-size: 24px;
                font-weight: 700;
                margin: 0 0 16px 0;
                letter-spacing: -0.02em;
            }}
            p {{
                color: #94a3b8;
                font-size: 16px;
                line-height: 1.6;
                margin: 0 0 32px 0;
            }}
            .otp-code {{
                font-size: 36px;
                font-weight: 800;
                letter-spacing: 8px;
                color: #38bdf8;
                background-color: #0f172a;
                padding: 16px 24px;
                border-radius: 12px;
                border: 1px dashed #334155;
                display: inline-block;
                margin: 20px 0;
            }}
            .expiry-note {{
                font-size: 13px;
                color: #64748b;
                margin-top: 16px;
            }}
            .footer {{
                margin-top: 40px;
                border-top: 1px solid #334155;
                padding-top: 24px;
            }}
            .footer p {{
                font-size: 13px;
                color: #64748b;
                margin-bottom: 8px;
            }}
        </style>
    </head>
    <body>
        <div class="wrapper">
            <div class="container">
                <div class="logo">Safvenn</div>
                <div class="illustration">🔑</div>
                <h1>Two-Factor Verification</h1>
                <p>Please use the following One-Time Password (OTP) to complete your login. Do not share this code with anyone.</p>
                <div class="otp-code">{otp}</div>
                <p class="expiry-note">This code will expire in 5 minutes for security reasons.</p>
                <div class="footer">
                    <p>If you didn't request this code, please secure your account immediately.</p>
                    <p>&copy; 2026 Safvenn. All rights reserved.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """

    message = MessageSchema(
        subject="Your Login Verification Code (OTP)",
        recipients=[email],
        body=html_content,
        subtype="html"
    )
    fm = FastMail(conf)
    await fm.send_message(message)

async def send_forgotpassword_email(email:str,token:str):
    link = f"http://localhost:5173/resetpassword/{token}"
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Forgot Password</title>
            <style>
                body {{
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    background-color: #0f172a;
                    color: #f8fafc;
                    margin: 0;
                    padding: 0;
                    -webkit-font-smoothing: antialiased;
                }}
                .wrapper {{
                    background-color: #0f172a;
                    width: 100%;
                    padding: 40px 0;
                }}
                .container {{
                    max-width: 580px;
                    margin: 0 auto;
                    padding: 40px 30px;
                    background-color: #1e293b;
                    border-radius: 16px;
                    border: 1px solid #334155;
                    text-align: center;
                }}
                .logo {{
                    font-size: 24px;
                    font-weight: 800;
                    letter-spacing: -0.04em;
                    color: #38bdf8;
                    margin-bottom: 24px;
                    text-transform: uppercase;
                }}
                .illustration {{
                    font-size: 48px;
                    margin-bottom: 24px;
                    line-height: 1;
                }}
                h1 {{
                    color: #ffffff;
                    font-size: 24px;
                    font-weight: 700;
                    margin: 0 0 16px 0;
                    letter-spacing: -0.02em;
                }}
                p {{
                    color: #94a3b8;
                    font-size: 16px;
                    line-height: 1.6;
                    margin: 0 0 32px 0;
                }}
                .btn-wrapper {{
                    margin-bottom: 32px;
                }}
                .btn {{
                    display: inline-block;
                    background: linear-gradient(135deg, #3b82f6, #6366f1);
                    background-color: #3b82f6;
                    color: #ffffff !important;
                    text-decoration: none;
                    padding: 14px 32px;
                    border-radius: 10px;
                    font-weight: 600;
                    font-size: 15px;
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
                }}
                .expiry-note {{
                    font-size: 13px;
                    color: #64748b;
                    margin-top: 16px;
                }}
                .footer {{
                    margin-top: 40px;
                    border-top: 1px solid #334155;
                    padding-top: 24px;
                }}
                .footer p {{
                    font-size: 13px;
                    color: #64748b;
                    margin-bottom: 8px;
                }}
            </style>
        </head>
        <body>
            <div class="wrapper">
                <div class="container">
                    <div class="logo">Safvenn</div>
                    <div class="illustration">🔑</div>
                    <h1>Forgot Password</h1>
                    <p>Tap the button below to reset your password. This link will expire in 30 minutes for security reasons.</p>
                    <div class="btn-wrapper">
                        <a href="{link}" class="btn">Reset Password</a>
                    </div>
                    <p class="expiry-note">This link will expire in 30 minutes for security reasons.</p>
                    <div class="footer">
                        <p>If you didn't request this email, you can safely ignore it.</p>
                        <p>&copy; 2026 Safvenn. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """

    message = MessageSchema(
            subject="Forgot Password",
            recipients=[email],
            body=html_content,
            subtype="html"
        )
    fm = FastMail(conf)
    await fm.send_message(message)