import { NextResponse } from "next/server";
import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }

    const { text } = await generateText({
      model: groq("compound-beta"),
      prompt: `Write a concise, engaging product description (max 3 sentences) for "${name}".`,
    });

    return NextResponse.json({ description: text });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error generating description" },
      { status: 500 }
    );
  }
}
