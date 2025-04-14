import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMaterialDto, UpdateMaterialDto } from './dto/material.dto';

@Injectable()
export class MaterialService {
    constructor(private readonly prisma: PrismaService) { }

    async createMaterial(data: CreateMaterialDto) { 
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

        console.log("Chat API response:", chatResponse);

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
                transcripted: responseText  ,
                fileUrl: data.fileUrl,
                fileType: data.fileType,
            },
        });
    }

    async updateMaterial(id: string, data: UpdateMaterialDto) { 
        return this.prisma.material.update({
            where: { id },
            data: {
                courseItem: {
                    update: {
                        name: data.name,
                        description: data.description,
                    }
                },
                fileUrl: data.fileUrl,
                fileType: data.fileType,
            },
        });
    }

    async deleteMaterial(id: string) { 
        return this.prisma.material.delete({
            where: { id },
        });
    }
}
