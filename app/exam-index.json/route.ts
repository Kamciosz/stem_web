import { NextResponse } from "next/server";
import { getExamIndex } from "@/lib/exam-index";

export const dynamic = "force-static";
export const revalidate = false;

export async function GET() {
    const entries = await getExamIndex();
    return NextResponse.json(entries, {
        headers: {
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
        },
    });
}
