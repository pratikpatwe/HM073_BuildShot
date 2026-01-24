import { NextRequest, NextResponse } from "next/server";
import { getTranscription } from "@/lib/stt";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const audioFile = formData.get("audio") as Blob;

        if (!audioFile) {
            return NextResponse.json({ error: "No audio provided" }, { status: 400 });
        }

        const arrayBuffer = await audioFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const transcript = await getTranscription(buffer);

        return NextResponse.json({ transcript });
    } catch (error: any) {
        console.error("STT Error:", error);
        return NextResponse.json({ error: error.message || "Transcription failed" }, { status: 500 });
    }
}
