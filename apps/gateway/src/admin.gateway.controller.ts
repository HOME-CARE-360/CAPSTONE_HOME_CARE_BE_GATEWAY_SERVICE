import {
    Body,
    Controller,
    Get,
    HttpException,
    Inject,
    Param,
    Patch,
    Post,
    Query,
    Delete,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ActiveUser } from 'libs/common/src/decorator/active-user.decorator';
import { ADMIN_SERVICE } from 'libs/common/src/constants/service-name.constant';
import { handlerErrorResponse, handleZodError } from 'libs/common/helpers';
import { RawTcpClientService } from 'libs/common/src/tcp/raw-tcp-client.service';
import {
    AssignPermissionsToRoleDTO,
    AssignRolesDTO,
    CreateRoleDTO,
    CreateUserDTO,
    GetUsersQuery,
    IdParamDTO,
    MonthlyReportDTO,
    MultiMonthReportDTO,
    ResetPasswordDTO,
    UpdateRoleDTO,
    UpdateUserDTO,
} from 'libs/common/src/request-response-type/admin/admin.dto';

@Controller('admin')
export class AdminGatewayController {
    constructor(
        @Inject(ADMIN_SERVICE)
        private readonly adminRawTcpClient: RawTcpClientService
    ) { }

    // === USER MANAGEMENT ===
    @Post('users')
    @ApiOperation({ summary: 'Create a new user' })
    async createUser(@Body() body: CreateUserDTO, @ActiveUser('userId') userId: number) {
        try {
            const data = await this.adminRawTcpClient.send({
                type: 'ADMIN_CREATE_USER',
                data: { ...body, adminId: userId },
            });
            handlerErrorResponse(data);
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error);
        }
    }

    @Get('users')
    @ApiOperation({ summary: 'Get all users' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'search', required: false, type: String })
    @ApiQuery({ name: 'role', required: false, type: String })
    @ApiQuery({ name: 'status', required: false, type: String })
    async getAllUsers(@Query() query: GetUsersQuery) {
        try {
            const data = await this.adminRawTcpClient.send({
                type: 'ADMIN_GET_USERS',
                data: query,
            });
            handlerErrorResponse(data);
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error);
        }
    }

    @Get('users/:id')
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiParam({ name: 'id', type: Number })
    async getUserById(@Param() params: IdParamDTO) {
        try {
            const data = await this.adminRawTcpClient.send({
                type: 'ADMIN_GET_USER_BY_ID',
                data: params,
            });
            handlerErrorResponse(data);
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error);
        }
    }

    @Patch('users/:id')
    @ApiOperation({ summary: 'Update user' })
    async updateUser(
        @Param() params: IdParamDTO,
        @Body() body: UpdateUserDTO,
        @ActiveUser('userId') userId: number
    ) {
        try {
            const data = await this.adminRawTcpClient.send({
                type: 'ADMIN_UPDATE_USER',
                data: { id: params.id, data: body, adminId: userId },
            });
            handlerErrorResponse(data);
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error);
        }
    }

    @Delete('users/:id')
    @ApiOperation({ summary: 'Delete user' })
    async deleteUser(@Param() params: IdParamDTO, @ActiveUser('userId') userId: number) {
        try {
            const data = await this.adminRawTcpClient.send({
                type: 'ADMIN_DELETE_USER',
                data: { ...params, adminId: userId },
            });
            handlerErrorResponse(data);
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error);
        }
    }

    @Patch('users/:id/block')
    @ApiOperation({ summary: 'Block user' })
    async blockUser(@Param() params: IdParamDTO, @ActiveUser('userId') userId: number) {
        try {
            const data = await this.adminRawTcpClient.send({
                type: 'ADMIN_BLOCK_USER',
                data: { ...params, adminId: userId },
            });
            handlerErrorResponse(data);
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error);
        }
    }

    @Patch('users/:id/unblock')
    @ApiOperation({ summary: 'Unblock user' })
    async unblockUser(@Param() params: IdParamDTO, @ActiveUser('userId') userId: number) {
        try {
            const data = await this.adminRawTcpClient.send({
                type: 'ADMIN_UNBLOCK_USER',
                data: { ...params, adminId: userId },
            });
            handlerErrorResponse(data);
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error);
        }
    }

    @Patch('users/:id/activate')
    @ApiOperation({ summary: 'Activate user' })
    async activateUser(@Param() params: IdParamDTO, @ActiveUser('userId') userId: number) {
        try {
            const data = await this.adminRawTcpClient.send({
                type: 'ADMIN_ACTIVATE_USER',
                data: { ...params, adminId: userId },
            });
            handlerErrorResponse(data);
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error);
        }
    }

    @Patch('users/:id/reset-password')
    @ApiOperation({ summary: 'Reset user password' })
    async resetUserPassword(
        @Param() params: IdParamDTO,
        @Body() body: ResetPasswordDTO,
        @ActiveUser('userId') userId: number
    ) {
        try {
            const data = await this.adminRawTcpClient.send({
                type: 'ADMIN_RESET_USER_PASSWORD',
                data: { ...params, ...body, adminId: userId },
            });
            handlerErrorResponse(data);
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error);
        }
    }

    @Patch('users/:id/restore')
    @ApiOperation({ summary: 'Restore deleted user' })
    async restoreUser(@Param() params: IdParamDTO, @ActiveUser('userId') userId: number) {
        try {
            const data = await this.adminRawTcpClient.send({
                type: 'ADMIN_RESTORE_USER',
                data: { ...params, adminId: userId },
            });
            handlerErrorResponse(data);
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error);
        }
    }

    @Get('users/deleted')
    @ApiOperation({ summary: 'Get deleted users' })
    async getDeletedUsers() {
        try {
            const data = await this.adminRawTcpClient.send({
                type: 'ADMIN_GET_DELETED_USERS',
                data: {},
            });
            handlerErrorResponse(data);
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error);
        }
    }

    // === ROLE MANAGEMENT ===
    @Post('roles')
    @ApiOperation({ summary: 'Create a new role' })
    async createRole(@Body() body: CreateRoleDTO, @ActiveUser('userId') userId: number) {
        try {
            const data = await this.adminRawTcpClient.send({
                type: 'ADMIN_CREATE_ROLE',
                data: { ...body, adminId: userId },
            });
            handlerErrorResponse(data);
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error);
        }
    }

    @Patch('roles/:id')
    @ApiOperation({ summary: 'Update role' })
    @ApiParam({ name: 'id', description: 'Role ID' })
    async updateRole(
        @Param() params: IdParamDTO,
        @Body() body: UpdateRoleDTO,
        @ActiveUser('userId') userId: number
    ) {
        try {
            const data = await this.adminRawTcpClient.send({
                type: 'ADMIN_UPDATE_ROLE',
                data: { ...params, ...body, adminId: userId },
            });
            handlerErrorResponse(data);
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error);
        }
    }

    @Delete('roles/:id')
    @ApiOperation({ summary: 'Delete role' })
    @ApiParam({ name: 'id', description: 'Role ID' })
    async deleteRole(@Param() params: IdParamDTO, @ActiveUser('userId') userId: number) {
        try {
            const data = await this.adminRawTcpClient.send({
                type: 'ADMIN_DELETE_ROLE',
                data: { ...params, adminId: userId },
            });
            handlerErrorResponse(data);
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error);
        }
    }

    @Get('roles')
    @ApiOperation({ summary: 'Get all roles' })
    async getAllRoles() {
        try {
            const data = await this.adminRawTcpClient.send({
                type: 'ADMIN_GET_ROLES',
                data: {},
            });
            handlerErrorResponse(data);
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error);
        }
    }

    @Get('roles/:id')
    @ApiOperation({ summary: 'Get role by ID' })
    async getRoleById(@Param() params: IdParamDTO) {
        try {
            const data = await this.adminRawTcpClient.send({
                type: 'ADMIN_GET_ROLE_BY_ID',
                data: params,
            });
            handlerErrorResponse(data);
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error);
        }
    }

    @Get('roles/:id/permissions')
    @ApiOperation({ summary: 'Get permissions by role' })
    async getPermissionsByRole(@Param() params: IdParamDTO) {
        try {
            const data = await this.adminRawTcpClient.send({
                type: 'ADMIN_GET_PERMISSIONS_BY_ROLE',
                data: { roleId: params.id },
            });
            handlerErrorResponse(data);
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error);
        }
    }

    @Post('roles/:roleId/permissions')
    @ApiOperation({ summary: 'Assign permissions to role' })
    async assignPermissionsToRole(
        @Param('roleId') roleId: number,
        @Body() body: AssignPermissionsToRoleDTO,
        @ActiveUser('userId') userId: number
    ) {
        try {
            const data = await this.adminRawTcpClient.send({
                type: 'ADMIN_ASSIGN_PERMISSIONS_TO_ROLE',
                data: { ...body, roleId, adminId: userId },
            });
            handlerErrorResponse(data);
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error);
        }
    }

    // === USER ROLE ASSIGNMENT ===
    @Post('users/:userId/roles')
    @ApiOperation({ summary: 'Assign roles to user' })
    async assignRolesToUser(
        @Param('userId') userId: number,
        @Body() body: AssignRolesDTO,
        @ActiveUser('userId') adminId: number
    ) {
        try {
            const data = await this.adminRawTcpClient.send({
                type: 'ADMIN_ASSIGN_ROLES',
                data: { ...body, userId, adminId },
            });
            handlerErrorResponse(data);
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error);
        }
    }

    @Get('users/:id/roles')
    @ApiOperation({ summary: 'Get user roles' })
    async getUserRoles(@Param() params: IdParamDTO) {
        try {
            const data = await this.adminRawTcpClient.send({
                type: 'ADMIN_GET_USER_ROLES',
                data: params,
            });
            handlerErrorResponse(data);
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error);
        }
    }

    @Get('permissions')
    @ApiOperation({ summary: 'Get all permissions' })
    async getAllPermissions() {
        try {
            const data = await this.adminRawTcpClient.send({
                type: 'ADMIN_GET_PERMISSIONS',
                data: {},
            });
            handlerErrorResponse(data);
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error);
        }
    }

    // === STATISTICS ===
    @Get('statistics/users')
    @ApiOperation({ summary: 'Get user statistics' })
    async getUserStatistics() {
        try {
            const data = await this.adminRawTcpClient.send({
                type: 'ADMIN_GET_USER_STATISTICS',
                data: {},
            });
            handlerErrorResponse(data);
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error);
        }
    }

    @Get('statistics/roles')
    @ApiOperation({ summary: 'Get role statistics' })
    async getRoleStatistics() {
        try {
            const data = await this.adminRawTcpClient.send({
                type: 'ADMIN_GET_ROLE_STATISTICS',
                data: {},
            });
            handlerErrorResponse(data);
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error);
        }
    }

    @Get('users/:id/activity')
    @ApiOperation({ summary: 'Get user activity logs' })
    async getUserActivity(@Param() params: IdParamDTO) {
        try {
            const data = await this.adminRawTcpClient.send({
                type: 'ADMIN_GET_USER_ACTIVITY',
                data: params,
            });
            handlerErrorResponse(data);
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error);
        }
    }

    // === REPORTS ===
    @Get('reports/monthly')
    @ApiOperation({ summary: 'Get monthly report' })
    @ApiQuery({ name: 'month', required: true, type: Number })
    @ApiQuery({ name: 'year', required: true, type: Number })
    async getMonthlyReport(@Query() query: MonthlyReportDTO, @ActiveUser('userId') userId: number) {
        try {
            const data = await this.adminRawTcpClient.send({
                type: 'ADMIN_GET_MONTHLY_REPORT',
                data: { ...query, adminId: userId },
            });
            handlerErrorResponse(data);
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error);
        }
    }

    @Get('reports/monthly/export/pdf')
    @ApiOperation({ summary: 'Export monthly report as PDF' })
    @ApiQuery({ name: 'month', required: true, type: Number })
    @ApiQuery({ name: 'year', required: true, type: Number })
    async exportMonthlyPDF(@Query() query: MonthlyReportDTO, @ActiveUser('userId') userId: number) {
        try {
            const data = await this.adminRawTcpClient.send({
                type: 'ADMIN_EXPORT_MONTHLY_PDF',
                data: { ...query, adminId: userId },
            });
            handlerErrorResponse(data);
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error);
        }
    }

    @Get('reports/multi-months/export/pdf')
    @ApiOperation({ summary: 'Export multi-month report as PDF' })
    @ApiQuery({ name: 'startMonth', required: true, type: Number })
    @ApiQuery({ name: 'startYear', required: true, type: Number })
    @ApiQuery({ name: 'endMonth', required: true, type: Number })
    @ApiQuery({ name: 'endYear', required: true, type: Number })
    async exportMultiMonthsPDF(
        @Query() query: MultiMonthReportDTO,
        @ActiveUser('userId') userId: number
    ) {
        try {
            const data = await this.adminRawTcpClient.send({
                type: 'ADMIN_EXPORT_MULTI_MONTHS_PDF',
                data: { ...query, adminId: userId },
            });
            handlerErrorResponse(data);
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error);
        }
    }
}


