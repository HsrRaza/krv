import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, service, details } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone number are required." },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    const leadData = {
      timestamp,
      name,
      phone,
      email: email || "N/A",
      service: service || "General Enquiry",
      details: details || "N/A",
    };

    console.log("==========================================");
    console.log("📩 NEW CLIENT APPOINTMENT / LEAD SUBMITTED!");
    console.log("------------------------------------------");
    console.log(`Name:        ${leadData.name}`);
    console.log(`Phone:       ${leadData.phone}`);
    console.log(`Email:       ${leadData.email}`);
    console.log(`Service:     ${leadData.service}`);
    console.log(`Details:     ${leadData.details}`);
    console.log(`Timestamp:   ${leadData.timestamp}`);
    console.log("==========================================");

    // Format pre-filled WhatsApp message URL for direct messaging to target number +91 8123758878
    const formattedWhatsAppMessage = encodeURIComponent(
      `*New Construction Enquiry - KRV Builders*\n\n` +
        `👤 *Name:* ${name}\n` +
        `📞 *Phone:* ${phone}\n` +
        `✉️ *Email:* ${email || "Not provided"}\n` +
        `🏗️ *Service:* ${service}\n` +
        `📝 *Details:* ${details || "No additional details"}`
    );

    const whatsappUrl = `https://wa.me/918123758878?text=${formattedWhatsAppMessage}`;

    return NextResponse.json({
      success: true,
      message: "Enquiry received successfully!",
      lead: leadData,
      whatsappUrl,
    });
  } catch (error) {
    console.error("Error processing contact form submission:", error);
    return NextResponse.json(
      { error: "Internal server error processing enquiry." },
      { status: 500 }
    );
  }
}
