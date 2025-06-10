import { RpcException } from '@nestjs/microservices';

export function InvalidCategoryIdException(invalidIds: number[]) {
    return new RpcException({
        message: 'Error.InvalidCategoryId',
        path: ['categoryRequirements'],
        meta: { invalidIds },
    });
}
