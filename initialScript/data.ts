import { RoleName } from "libs/common/src/constants/role.constant"
import { PrismaClient } from '@prisma/client'
import { HashingService } from "libs/common/src/services/hashing.service"

const prisma = new PrismaClient()
const main1 = async () => {
    const hashingService = new HashingService()
    const roleCount = await prisma.role.count()
    if (roleCount > 0) {
        throw new Error('Roles already exist')
    }
    const roles = await prisma.role.createMany({
        data: [{
            name: RoleName.Admin,
        }, {
            name: RoleName.Customer,
        }, {
            name: RoleName.ServiceProvider,

        },
        {
            name: RoleName.Staff,

        }, {
            name: RoleName.Manager,

        }]
    })
    const adminRole = await prisma.role.findFirstOrThrow({
        where: {
            name: RoleName.Admin,
        }
    })
    const hash = await hashingService.hash("Trantien@2911")
    const adminUser = await prisma.user.create({
        data: {
            email: "tranngoctien29112003@gmail.com",
            password: hash,
            name: "tranngoctien29112003@gmail.com",
            phone: "0389744312",
            roles: {
                connect: {
                    id: adminRole.id
                }
            }
        }
    })
    return {
        // createdRoleCount: roles.count,
        adminUser
    }
}
main1()