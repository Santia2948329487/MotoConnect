import { NextResponse } from "next/server";
import { Resend } from "resend";

// Deberías guardar tu API KEY en un archivo .env
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Enviar el correo
    const { data, error } = await resend.emails.send({
      from: "MotoConnect <onboarding@resend.dev>", // Cambia esto por tu dominio verificado
      to: [email],
      subject: "Restablece tu contraseña - MotoConnect",
      html: `
        <h1>Recuperación de Contraseña</h1>
        <p>Has solicitado restablecer tu contraseña en MotoConnect.</p>
        <p>Haz clic en el siguiente enlace para continuar:</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/auth/resetpassword?token=TOKEN_GENERADO">
          Restablecer Contraseña
        </a>
        <p>Si no solicitaste esto, puedes ignorar este correo.</p>
      `,
    });

    if (error) {
      return NextResponse.json({ message: "Error al enviar el correo" }, { status: 400 });
    }

    return NextResponse.json({ message: "Correo enviado con éxito" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}