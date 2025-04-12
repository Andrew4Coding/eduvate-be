import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MaterialService {
    constructor(private readonly prisma: PrismaService) { }
}