import { z } from 'zod';

export const scanTicketSchema = z.object({
  uuid: z.string().min(1),
  imgUrl: z.string().min(1),
});

export const scanStatusSchema = z.object({
  code: z.string().min(1).nullable(),
  message: z.string().nullable(),
});

export type ScanTicketPayload = z.infer<typeof scanTicketSchema>;
export type ScanStatusPayload = z.infer<typeof scanStatusSchema>;
