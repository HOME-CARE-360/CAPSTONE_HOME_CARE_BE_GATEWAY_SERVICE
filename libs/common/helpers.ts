
import { Prisma, WeekDay } from '@prisma/client';
import { randomInt } from 'crypto'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { HttpException, HttpStatus } from '@nestjs/common';
// Type Predicate
export function isUniqueConstraintPrismaError(error: any): error is Prisma.PrismaClientKnownRequestError {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'
}

export function isNotFoundPrismaError(error: any): error is Prisma.PrismaClientKnownRequestError {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025'
}

export function isForeignKeyConstraintPrismaError(error: any): error is Prisma.PrismaClientKnownRequestError {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003'
}

export const generateOTP = () => {
    return String(randomInt(100000, 1000000))
}

export const generateRandomFilename = (filename: string) => {
    const ext = path.extname(filename)
    return `${uuidv4()}${ext}`
}

export const generateCancelPaymentJobId = (paymentId: number) => {
    return `paymentId-${paymentId}`
}

export const generateRoomUserId = (userId: number) => {
    return `userId-${userId}`
}
export const toMinutes = (time: string): number => {
    const [hour, minute] = time.split(':').map(Number)
    return hour * 60 + minute
}
export const adjustDateToWeekday = (startDate: Date, day: WeekDay): Date => {
    const dayMap = {
        MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3,
        THURSDAY: 4, FRIDAY: 5, SATURDAY: 6, SUNDAY: 0,
    };

    const targetDay = dayMap[day];
    const current = startDate.getDay();
    const diff = (targetDay + 7 - current) % 7;
    const result = new Date(startDate);
    result.setDate(startDate.getDate() + diff);
    return result;
}
export function handlerErrorResponse(data: any) {
    if (data.statusCode !== 201 && data.statusCode !== 200) {
        throw new HttpException(
            data ?? "Internal server error",
            data.statusCode
        );
    }
}

export function handleZodError(error: any): never {
    const errorResponse = error?.error?.response || error?.response || null;

    // attempt to get status code
    const status =
        error?.status ||
        error?.response?.statusCode ||
        error?.error?.status ||
        error?.error?.response?.statusCode ||
        HttpStatus.INTERNAL_SERVER_ERROR;

    console.log("Zod error handler caught:", {
        errorResponse,
        status
    });

    throw new HttpException(
        errorResponse ?? "Internal server error",
        status
    );
}

