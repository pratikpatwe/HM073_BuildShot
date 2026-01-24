import { createClient } from "@deepgram/sdk";

export const getTranscription = async (audioBuffer: Buffer) => {
    const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);

    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
        audioBuffer,
        {
            model: "nova-2",
            smart_format: true,
        }
    );

    if (error) {
        throw error;
    }

    return result.results.channels[0].alternatives[0].transcript;
};
