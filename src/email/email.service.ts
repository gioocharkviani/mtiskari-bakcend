import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
import { emailDto } from "./dto/email.dto";
import * as fs from "fs";
import * as path from "path";
import * as Handlebars from "handlebars";

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  //-----------------------------------------------RENDER EMAIL TEMPLATE
  private async renderTemplate(
    templateName: string,
    data: any,
  ): Promise<string> {
    const possiblePaths = [
      // For development (running from src)
      path.join(
        process.cwd(),
        "src",
        "email",
        "templates",
        `${templateName}.html`,
      ),
      // For production (running from dist)
      path.join(
        process.cwd(),
        "dist",
        "email",
        "templates",
        `${templateName}.html`,
      ),
      // Relative path from the current file
      path.join(__dirname, "templates", `${templateName}.html`),
      path.join(__dirname, "..", "email", "templates", `${templateName}.html`),
    ];

    let templatePath: string | null = null;

    // Find the first existing path
    for (const possiblePath of possiblePaths) {
      if (fs.existsSync(possiblePath)) {
        templatePath = possiblePath;
        break;
      }
    }

    if (!templatePath) {
      throw new Error(
        `Template ${templateName} not found. Tried paths: ${possiblePaths.join(", ")}`,
      );
    }

    const template = fs.readFileSync(templatePath, "utf8");
    const compiledTemplate = Handlebars.compile(template);
    const defaultData = {
      year: new Date().getFullYear(),
      companyName: this.configService.get("COMPANY_NAME") || "Our Company",
      footerText:
        this.configService.get("COMPANY_NAME") || "Thank you for choosing us",
      headerColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      buttonColor: "#667eea",
      closingMessage: "Best regards,<br/>The Team",
      ...data,
    };

    return compiledTemplate(defaultData);
  }

  //------------------------------------------------------SEND BOOKING CONFIRMATION
  async sendBookingConfirmationToCustomer(bookingData: any) {
    const html = await this.renderTemplate("booking-confirmation-customer", {
      customerName: bookingData.customerName,
      bookingReference: bookingData.reference,
      bookingStatus: bookingData.bookingStatus || "CONFIRMED",
      checkInDate: bookingData.checkInDate,
      checkInTime: bookingData.checkInTime,
      checkOutDate: bookingData.checkOutDate,
      checkOutTime: bookingData.checkOutTime,
      duration: bookingData.duration,
      bookingDetails: bookingData.details || [],
      totalAmount: bookingData.totalAmount,
      viewBookingUrl:
        bookingData.viewBookingUrl ||
        `${this.configService.get("APP_URL")}/bookings/${bookingData.id}`,
      addToCalendarUrl: bookingData.addToCalendarUrl || "#",
      companyName: this.configService.get("COMPANY_NAME") || "Our Company",
      companyAddress:
        this.configService.get("COMPANY_ADDRESS") || "123 Main Street",
      companyPhone:
        this.configService.get("COMPANY_PHONE") || "+1 234 567 8900",
      companyEmail:
        this.configService.get("COMPANY_EMAIL") || "support@example.com",
    });

    return this.sendEmail({
      recipients: bookingData.customerEmail,
      subject: `Booking Confirmed - ${bookingData.reference}`,
      html: html,
    });
  }

  //------------------------------------------------------SEND NEW BOOKING NOTIFICATION TO ADMIN

  async sendBookingNotificationToAdmin(bookingData: any) {
    const ADMIN = this.configService.get("EMAIL_USER");
    const html = await this.renderTemplate("booking-confirmation-admin", {
      customerName: bookingData.customerName,
      customerEmail: bookingData.customerEmail,
      customerPhone: bookingData.customerPhone,
      bookingDate: bookingData.bookingDate || new Date().toLocaleString(),
      bookingReference: bookingData.reference,
      serviceType: bookingData.serviceType || "Booking",
      checkInDate: bookingData.checkInDate,
      checkInTime: bookingData.checkInTime || "3am",
      checkOutDate: bookingData.checkOutDate,
      checkOutTime: bookingData.checkOutTime || "12am",
      duration: bookingData.duration,
      numberOfGuests: bookingData.numberOfGuests || "1",
      specialRequests: bookingData.specialRequests || "None",
      totalAmount: bookingData.totalAmount,
      paymentStatus: bookingData.paymentStatus || "Pending",
      paymentStatusColor:
        bookingData.paymentStatus === "PAID" ? "#28a745" : "#dc3545",
      paymentMethod: bookingData.paymentMethod || "Not specified",
      transactionId: bookingData.transactionId || "N/A",
      confirmBookingUrl: bookingData.confirmBookingUrl || "",
      contactCustomerUrl: `mailto:${bookingData.customerEmail}`,
      companyName: this.configService.get("COMPANY_NAME") || "Our Company",
      adminPanelUrl: this.configService.get("ADMIN_URL") || "#",
      adminEmail: ADMIN,
    });

    return this.sendEmail({
      recipients: [ADMIN],
      subject: `New Booking Alert - ${bookingData.reference}`,
      html: html,
    });
  }

  //-----------------------------------------------SEND EMAIL WITH UNIVERSAL TEMPLATE
  async sendUniversalTemplateEmail(data: any) {
    const HTML = await this.renderTemplate("default", {
      content: data.html || "NO CONTENT",
      companyEmail: await this.configService.get("COMPANY_EMAIL"),
      companyPhone: await this.configService.get("COMPANY_PHONE"),
      companyName: await this.configService.get("COMPANY_NAME"),
      year: await this.configService.get("YEAR"),
      companyAddress: await this.configService.get("COMPANY_ADDRESS"),
    });
    return this.sendEmail({
      recipients: data.recipients,
      subject: `${data.subject}`,
      html: HTML,
    });
  }
  //-----------------------------------------------SEND EMAIL WITH UNIVERSAL TEMPLATE

  //----------------------------------------------- EMAIL TRANSPORT
  emailTransport() {
    const transporter = nodemailer.createTransport({
      host: this.configService.get("EMAIL_HOST"),
      port: this.configService.get("EMAIL_PORT"),
      secure: false,
      auth: {
        user: this.configService.get("EMAIL_USER"),
        pass: this.configService.get("EMAIL_PASS"),
      },
    });
    return transporter;
  }

  //--------------------------------------------------- SEND EMAIL
  async sendEmail(dto: emailDto) {
    const { recipients, subject, html } = dto;

    const transport = this.emailTransport();

    const options: nodemailer.SendMailOptions = {
      from: this.configService.get("EMAIL_USER"),
      to: recipients,
      subject: subject,
      html: html,
    };
    try {
      await transport.sendMail(options);
      return "email sent seccessfully";
    } catch (error) {
      console.log("Error sending mail: ", error);
    }
  }
}
