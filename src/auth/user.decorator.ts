import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { userData } from './auth.guard';

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request: {
            user: userData
        } = ctx.switchToHttp().getRequest();
        return request.user;
    },
);
