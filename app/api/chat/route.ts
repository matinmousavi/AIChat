import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const body = await request.json();
  const messages = body.messages;

  if (!messages) {
    return NextResponse.json({ error: "پیام‌ها خالی است" }, { status: 400 });
  }

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "anthropic/claude-3-haiku",
          messages: messages,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("خطا از OpenRouter:", errorData);
      throw new Error(`Error from OpenRouter: ${errorData.error.message}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;

    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    console.error("خطا در ارتباط با OpenRouter API:", error);
    return NextResponse.json(
      { error: "مشکلی در ارتباط با هوش مصنوعی پیش آمد." },
      { status: 500 }
    );
  }
};
