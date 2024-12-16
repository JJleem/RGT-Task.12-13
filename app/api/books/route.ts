import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const isbn = searchParams.get("isbn");

  if (!isbn || typeof isbn !== "string") {
    return NextResponse.json(
      { error: "ISBN is required and must be a string" },
      { status: 400 }
    );
  }

  const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch from Google API: ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return NextResponse.json(
        { error: "No book found for this ISBN" },
        { status: 404 }
      );
    }

    return NextResponse.json(data.items); // 전체 검색 결과 반환
  } catch (error) {
    console.error("API Handler Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
