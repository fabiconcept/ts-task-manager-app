export class BrevoEmailClient {
    private readonly apiKey: string;

    constructor() {
        this.apiKey = process.env.NEXT_PUBLIC_SMTP_API!;
    }

    async sendEmail(
        recipientName: string,
        recipientEmail: string,
        subject: string,
        htmlContent: string
    ): Promise<Response> {
        const headers = new Headers({
            'accept': 'application/json',
            'api-key': this.apiKey,
            'content-type': 'application/json',
        });

        const body = JSON.stringify({
            sender: {
                name: "Taskify",
                email: "noreply@taskity.com",
            },
            to: [
                {
                    email: recipientEmail,
                    name: recipientName,
                },
            ],
            subject,
            htmlContent,
        });

        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers,
            body,
        });

        return response;
    }
}