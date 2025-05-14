import { PutObjectCommand } from '@aws-sdk/client-s3';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { PrismaService } from 'src/prisma/prisma.service';
import { s3 } from 'src/s3/s3.service';
import { CreateMaterialDto } from './dto/material.dto';

@Processor('material-queue')
export class MaterialProcessor {
    constructor(private readonly prisma: PrismaService) { }

    @Process('create-material')
    async handleCreateMaterial(job: Job) {
        const data = job.data as CreateMaterialDto

        const context = 'You are a helpful assistant.Please elaborate and summarize the following text in Bahasa Indonesia, jawab dalam plain text dan tidak ada markdown sama sekali'

        const chatResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    ...(context ? [{ role: "assistant", content: context }] : []),
                    { role: "user", content: data.transcripted },
                ],
                max_tokens: 10000,
            }),
        });

        if (!chatResponse.ok) {
            const errorData = await chatResponse.json();
            console.error("Chat API error:", errorData);
            throw new Error("Failed to generate response");
        }

        const chatData = await chatResponse.json();
        const responseText = chatData.choices[0].message.content;


        const newMaterial = await this.prisma.material.create({
            data: {
                courseItem: {
                    create: {
                        name: data.name,
                        description: data.description,
                        courseSectionId: data.courseSectionId,
                        type: 'MATERIAL',
                    }
                },
                transcripted: responseText,
                fileUrl: data.fileUrl,
            },
        });
        console.log(newMaterial);
        

        this.getAndUploadAudio(responseText, newMaterial.id)
        


        return newMaterial;
    }

    async getAndUploadAudio(text: string, materialId: string) {
        console.log(text);
        
        const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/3AwU3nHsI4YWeBJbz6yn?output_format=mp3_44100_128", {
            method: "POST",
            headers: {
                'Xi-Api-Key': process.env.LABS_API_KEY as string,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                model_id: "eleven_multilingual_v2"
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch audio: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer); // Node.js compatible

        const fileName = `audio/${Date.now()}-audio.mp3`;

        const uploadParams = {
            Bucket: process.env.AMPLIFY_BUCKET!,
            Key: fileName,
            Body: buffer, // Use Buffer, not stream or File
            ContentType: 'audio/mpeg',
        };

        await s3.send(new PutObjectCommand(uploadParams));

        const audioUrl = `https://${process.env.AMPLIFY_BUCKET}.s3.amazonaws.com/${fileName}`;

        console.log('Audio URL:', audioUrl);

        // Update database
        await this.prisma.material.update({
            where: { id: materialId },
            data: { audioUrl },
        });

        return audioUrl;
    }
}
