import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OAuth2Client } from "google-auth-library";
import * as nodemailer from "nodemailer";
import { mailOptions } from "./types";

@Injectable()
export class MailService {
  private authClient: OAuth2Client;
  transporter: nodemailer.Transporter;
  logger = new Logger("User Service");

  constructor(private readonly configService: ConfigService) {
    (async () => {
      const { clientId, clientSecret, redirectUri, refreshToken, from } =
        await this.getAuthConfigs();

      this.authClient = new OAuth2Client({
        clientId,
        clientSecret,
        redirectUri,
      });

      this.authClient.setCredentials({
        refresh_token: refreshToken,
      });

      const accessToken = await this.getAccessToken();
      this.transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: from,
          clientId,
          clientSecret,
          type: "OAUTH2",
          accessToken,
          refreshToken,
        },
      });
    })();
  }

  private async getAuthConfigs(): Promise<{
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    refreshToken: string;
    from: string;
  }> {
    return {
      clientId: this.configService.get<string>("GMAIL_CLIENT_ID"),
      clientSecret: this.configService.get<string>("GMAIL_REDIRECT_SECRET"),
      redirectUri: this.configService.get<string>("GMAIL_REDIRECT_URI"),
      refreshToken: this.configService.get<string>("GMAIL_REFRESH_TOKEN"),
      from: this.configService.get<string>("GMAIL_CLIENT_FROM"),
    };
  }

  async sendEmail(options: mailOptions): Promise<void> {
    const { to, subject, text } = options;
    const mailOptions = {
      from: this.configService.get<string>("GMAIL_CLIENT_MAIL"),
      to,
      subject,
      text,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.debug("Email sent successfully");
    } catch (error) {
      this.logger.error("Error sending email:", error);
      throw error;
    }
  }

  getVerificationTemplate({
    firstName,
    token,
  }: {
    firstName: string;
    token: string;
  }): string {
    try {
      return `Hi ${firstName},
          Thanks for creating account in FortressEye.
          Use the link below to verify your account ${token}
          `;
    } catch (error) {
      throw new Error("Something went wrong");
    }
  }

  getInvitationTemplate({ token }: { token: string }): string {
    try {
      return `Hello,
          you've been invited to join FortressEye.
          Use the link below to get started ${token}
          `;
    } catch (error) {
      throw new Error("Something went wrong");
    }
  }

  private async getAccessToken(): Promise<string> {
    try {
      const { token } = await this.authClient.getAccessToken();
      return token;
    } catch (error) {
      this.logger.error("Error refreshing access token:", error);
      throw error;
    }
  }
}
