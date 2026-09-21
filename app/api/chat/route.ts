import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const messages = body.messages;

  if (!messages) {
    return new Response(JSON.stringify({ error: "پیام‌ها خالی است" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error:
          "کلید OpenRouter تنظیم نشده است. فایل .env.local بسازید و OPENROUTER_API_KEY را اضافه کنید.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  try {
    const upstream = await fetch(
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
          stream: true,
        }),
      },
    );

    if (!upstream.ok || !upstream.body) {
      const errorData = await upstream.json().catch(() => ({}));
      console.error("خطا از OpenRouter:", errorData);
      const message =
        typeof errorData?.error?.message === "string"
          ? errorData.error.message
          : "درخواست به OpenRouter ناموفق بود.";
      return new Response(JSON.stringify({ error: message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("خطا در ارتباط با OpenRouter API:", error);
    return new Response(
      JSON.stringify({ error: "مشکلی در ارتباط با هوش مصنوعی پیش آمد." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};