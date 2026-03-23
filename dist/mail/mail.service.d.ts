import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private cfg;
    private transporter;
    private readonly logger;
    constructor(cfg: ConfigService);
    sendBookingConfirmation(to: string, booking: any): Promise<void>;
    sendPaymentReminder(to: string, booking: any, daysLeft: number): Promise<void>;
    private bookingConfirmHtml;
}
