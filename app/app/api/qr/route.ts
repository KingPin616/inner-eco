import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  void request;

  return NextResponse.json(
    {
      error:
        "QR generation is disabled. Existing QR codes continue to work and point to their plant endpoints.",
    },
    { status: 410 },
  );
}