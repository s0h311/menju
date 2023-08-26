import { createTRPCReact } from '@trpc/react-query'
import { AppRouter } from "@/trpc/trpc-server/trpc-server";
export const trpc = createTRPCReact<AppRouter>()
