import { createTRPCReact } from '@trpc/react-query';
import { AppRouter } from '../rpcServer/router';

export const trpc = createTRPCReact<AppRouter>();
