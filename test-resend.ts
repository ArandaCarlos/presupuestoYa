import { Resend } from 'resend';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
    console.log('Testing Resend delivery to soporte@presupuestosya.app...');
    const { data, error } = await resend.emails.send({
        from: 'PresupuestosYA <contacto@presupuestosya.app>',
        to: ['soporte@presupuestosya.app'],
        subject: 'Prueba de entrega desde Resend',
        html: '<p>Este es un email de prueba para verificar si el dominio de Hostinger acepta correos desde Resend.</p>'
    });

    if (error) {
        console.error('Error sending test email:', error);
    } else {
        console.log('Test email sent successfully! ID:', data?.id);
    }
}

testEmail();
