import { FILE_TYPE } from "@prisma/client";

export class CreateMaterialDto {
    courseSectionId: string;
    transcripted: string;
    name: string;
    description: string;
    fileUrl: string;
    fileType: FILE_TYPE;
}

export class UpdateMaterialDto {
    name?: string;
    transcripted?: string;
    description?: string;
    fileUrl?: string;
    fileType?: FILE_TYPE;
}