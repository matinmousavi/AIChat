import { NextResponse } from "next/server";

const cannedResponses = [
  "این سوال خیلی جالبیه! بذار کمی فکر کنم...",
  "درک می‌کنم. می‌تونی بیشتر در این مورد توضیح بدی؟",
  "چه موضوع خوبی برای صحبت. از دیدگاه من...",
  "برای پاسخ دقیق‌تر به اطلاعات بیشتری نیاز دارم.",
  "این یک دیدگاه متداوله. از طرفی، می‌تونیم اینطور هم به قضیه نگاه کنیم که...",
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const POST = async (request: Request) => {
  const body = await request.json();
  const userMessage = body.message;

  if (!userMessage) {
    return NextResponse.json({ error: "پیام خالی است" }, { status: 400 });
  }

  await sleep(Math.random() * 2000 + 1000);

  const randomIndex = Math.floor(Math.random() * cannedResponses.length);
  const aiMessage = cannedResponses[randomIndex];

  return NextResponse.json({ message: aiMessage });
};