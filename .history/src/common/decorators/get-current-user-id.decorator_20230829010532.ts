import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const GetCurrentUserId = createParamDecorator(
  (data: undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.cookies['access_token']; // Replace with actual cookie name

    // Decode the access token to get user ID
    const decodedToken = jwt.decode(accessToken) as { sub: string }; // Assuming the user ID is in the 'sub' field

    return decodedToken.sub;
  },
);
