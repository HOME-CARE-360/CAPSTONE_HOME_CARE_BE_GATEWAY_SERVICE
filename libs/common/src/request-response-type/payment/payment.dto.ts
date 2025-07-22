import { createZodDto } from "nestjs-zod";
import { CreateTransactionSchema, UpdateTransactionStatusSchema, WalletTopUpSchema } from "./payment.model";

export class CreateTransactionDto extends createZodDto(CreateTransactionSchema) { }
export class UpdateTransactionStatusDto extends createZodDto(UpdateTransactionStatusSchema) { }
export class WalletTopUpDto extends createZodDto(WalletTopUpSchema) { }     
