// jwt-auth.guard.ts
import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

export interface userData {
    role: 'student' | 'teacher' | 'admin';
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    image?: string | null | undefined | undefined;
}

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name);

    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest<Request>();

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Missing or invalid Authorization header');
        }

        const token = authHeader.split(' ')[1];

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET as string); // replace with env var in real app

            // @ts-expect-error
            req.user = payload as userData; // attach payload to request
            return true;
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}

export async function validateRole(
    user: userData,
    roles: ('student' | 'teacher' | 'admin')[],
): Promise<boolean> {
    const isValidRole = roles.includes(user.role);

    if (!isValidRole) {
        throw new UnauthorizedException('You do not have permission to access this resource');
    }

    return isValidRole;
}
