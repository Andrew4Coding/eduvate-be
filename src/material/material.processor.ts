import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { CreateMaterialDto } from './dto/material.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Processor('material-queue')
export class MaterialProcessor {
    constructor(private readonly prisma: PrismaService) { }

    @Process('create-material')
    async handleCreateMaterial(job: Job) {
        const data = job.data as CreateMaterialDto

        console.log(data);
        

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

        return this.prisma.material.create({
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
                fileType: data.fileType,
            },
        });
    }
}
