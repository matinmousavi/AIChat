import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const body = await request.json();
  const messages = body.messages;

  if (!messages) {
    return NextResponse.json({ error: "پیام‌ها خالی است" }, { status: 400 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "کلید OpenRouter تنظیم نشده است. فایل .env.local بسازید و OPENROUTER_API_KEY را اضافه کنید.",
      },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "anthropic/claude-3-haiku",
          messages: messages,
          max_tokens: 1000,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("خطا از OpenRouter:", errorData);
      const message =
        typeof errorData?.error?.message === "string"
          ? errorData.error.message
          : "درخواست به OpenRouter ناموفق بود.";
      throw new Error(message);
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;

    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    console.error("خطا در ارتباط با OpenRouter API:", error);
    return NextResponse.json(
      { error: "مشکلی در ارتباط با هوش مصنوعی پیش آمد." },
      { status: 500 },
    );
  }
};
