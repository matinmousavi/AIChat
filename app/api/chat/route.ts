import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const body = await request.json();
  const userMessage = body.message;

  const responseMessage = `ممنون که پیام دادی! پیام شما این بود: "${userMessage}"`;

  return NextResponse.json({ message: responseMessage });
};