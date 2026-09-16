import { NextResponse } from "next/server";

export const runtime = "edge";

export const POST = async (request: Request) => {
  const body = await request.json();
  const { message } = body;

  if (!message) {
    return NextResponse.json({ error: "پیام خالی است" }, { status: 400 });
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

  const titlePrompt = `Summarize the following user's first message into a short, 3-to-5-word title. Respond ONLY with the title itself, without any introductory text, quotes, or punctuation. The user's message is: "${message}"`;

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
          messages: [{ role: "user", content: titlePrompt }],
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        typeof errorData?.error?.message === "string"
          ? errorData.error.message
          : "درخواست به OpenRouter ناموفق بود.";
      throw new Error(`Error from OpenRouter: ${errorMessage}`);
    }

    const data = await response.json();
    const title = data.choices[0].message.content;

    return NextResponse.json({ title });
  } catch (error) {
    console.error("خطا در تولید عنوان:", error);
    return NextResponse.json(
      { error: "مشکلی در تولید عنوان پیش آمد." },
      { status: 500 },
    );
  }
};
