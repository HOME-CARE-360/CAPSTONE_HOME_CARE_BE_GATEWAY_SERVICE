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
    ParseIntPipe,
    DefaultValuePipe,
} from '@nestjs/common';
import { 
    ApiOperation, 
    ApiParam, 
    ApiQuery, 
    ApiBearerAuth, 
    ApiTags,
    ApiResponse 
} from '@nestjs/swagger';
import { ActiveUser } from 'libs/common/src/decorator/active-user.decorator';
import { ADMIN_SERVICE } from 'libs/common/src/constants/service-name.constant';
import { handlerErrorResponse, handleZodError } from 'libs/common/helpers';
import { RawTcpClientService } from 'libs/common/src/tcp/raw-tcp-client.service';
import {
    AssignPermissionsToRoleDTO,
    AssignRolesDTO,
    CreateRoleDTO,
    CreateUserDTO,
    ResetPasswordDTO,
    UpdateRoleDTO,
} from 'libs/common/src/request-response-type/admin/admin.dto';

@Controller('admin')
@ApiTags('Admin Management')
@ApiBearerAuth()
export class AdminGatewayController {
    constructor(
        @Inject(ADMIN_SERVICE)
        private readonly adminRawTcpClient: RawTcpClientService
    ) { }

    // === USER MANAGEMENT ===
    
    @Get('users')
    @ApiOperation({ summary: 'Get all users with filtering and pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by username or email' })
    @ApiQuery({ name: 'role', required: false, type: String, description: 'Filter by role' })
    @ApiQuery({ name: 'status', required: false, type: String, description: 'Filter by status (active, inactive, blocked)' })
    @ApiResponse({ status: 200, description: 'List of users retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    async getAllUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('status') status?: string,
    ) {
    try {
        const data = await this.adminRawTcpClient.send({
        type: 'ADMIN_GET_USERS',
        data: {
            page,
            limit,
            search,
            role,
            status,
        },
        });
        handlerErrorResponse(data);
        return data;
    } catch (error) {
        if (error instanceof HttpException) throw error;
        handleZodError(error);
    }
    }


   @Get('users/deleted')
    @ApiOperation({ summary: 'Get all deleted users (with pagination)' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiResponse({ status: 200, description: 'List of deleted users retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    async getDeletedUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
    try {
        const data = await this.adminRawTcpClient.send({
        type: 'ADMIN_GET_DELETED_USERS',
        data: { page, limit },
        });
        handlerErrorResponse(data);
        return data;
    } catch (error) {
        if (error instanceof HttpException) throw error;
        handleZodError(error);
    }
    }


    @Post('users')
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'User created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    @ApiResponse({ status: 409, description: 'Conflict - User already exists' })
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

    @Get('users/:id')
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'User ID' })
    @ApiResponse({ status: 200, description: 'User retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async getUserById(@Param('id', ParseIntPipe) id: number) {
        try {
            const data = await this.adminRawTcpClient.send({
                type: 'ADMIN_GET_USER_BY_ID',
                data: { id },
            });
            handlerErrorResponse(data);
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error);
        }
    }

    // @Patch('users/:id')
    // @ApiOperation({ summary: 'Update user information' })
    // @ApiParam({ name: 'id', type: Number, description: 'User ID' })
    // @ApiResponse({ status: 200, description: 'User updated successfully' })
    // @ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
    // @ApiResponse({ status: 401, description: 'Unauthorized' })
    // @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    // @ApiResponse({ status: 404, description: 'User not found' })
    // async updateUser(
    //     @Param('id', ParseIntPipe) id: number,
    //     @Body() body: UpdateUserDTO,
    //     @ActiveUser('userId') userId: number
    // ) {
    //     try {
    //         const data = await this.adminRawTcpClient.send({
    //             type: 'ADMIN_UPDATE_USER',
    //             data: { id, data: body, adminId: userId },
    //         });
    //         handlerErrorResponse(data);
    //         return data;
    //     } catch (error) {
    //         if (error instanceof HttpException) throw error;
    //         handleZodError(error);
    //     }
    // }

    @Delete('users/:id')
    @ApiOperation({ summary: 'Delete user (soft delete)' })
    @ApiParam({ name: 'id', type: Number, description: 'User ID' })
    @ApiResponse({ status: 200, description: 'User deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async deleteUser(@Param('id', ParseIntPipe) id: number, @ActiveUser('userId') userId: number) {
        try {
            const data = await this.adminRawTcpClient.send({
                type: 'ADMIN_DELETE_USER',
                data: { id, adminId: userId },
            });
                    handlerErrorResponse(data);

            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error);
        }
    }

    @Patch('users/:id/block')
    @ApiOperation({ summary: 'Block user account' })
    @ApiParam({ name: 'id', type: Number, description: 'User ID' })
    @ApiResponse({ status: 200, description: 'User blocked successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async blockUser(@Param('id', ParseIntPipe) id: number, @ActiveUser('userId') userId: number) {
        try {
            const data = await this.adminRawTcpClient.send({
                type: 'ADMIN_BLOCK_USER',
                data: { id, adminId: userId },
            });
                    handlerErrorResponse(data);
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error);
        }
    }

    @Patch('users/:id/unblock')
    @ApiOperation({ summary: 'Unblock user account' })
    @ApiParam({ name: 'id', type: Number, description: 'User ID' })
    @ApiResponse({ status: 200, description: 'User unblocked successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async unblockUser(@Param('id', ParseIntPipe) id: number, @ActiveUser('userId') userId: number) {
        try {
            const data = await this.adminRawTcpClient.send({
                type: 'ADMIN_UNBLOCK_USER',
                data: { id, adminId: userId },
            });
            handlerErrorResponse(data);
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error);
        }
    }

    @Patch('users/:id/activate')
    @ApiOperation({ summary: 'Activate user account' })
    @ApiParam({ name: 'id', type: Number, description: 'User ID' })
    @ApiResponse({ status: 200, description: 'User activated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async activateUser(@Param('id', ParseIntPipe) id: number, @ActiveUser('userId') userId: number) {
        try {
            const data = await this.adminRawTcpClient.send({
                type: 'ADMIN_ACTIVATE_USER',
                data: { id, adminId: userId },
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
    @ApiParam({ name: 'id', type: Number, description: 'User ID' })
    @ApiResponse({ status: 200, description: 'Password reset successfully' })
    @ApiResponse({ status: 400, description: 'Bad request - Invalid password' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async resetUserPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ResetPasswordDTO,
    @ActiveUser('userId') userId: number
    ) {
    try {
        const data = await this.adminRawTcpClient.send({
        type: 'ADMIN_RESET_USER_PASSWORD',
        data: {
            id,
            newPassword: body.newPassword,
            confirmPassword: body.confirmPassword,
            adminId: userId,
        },
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
    @ApiParam({ name: 'id', type: Number, description: 'User ID' })
    @ApiResponse({ status: 200, description: 'User restored successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async restoreUser(@Param('id', ParseIntPipe) id: number, @ActiveUser('userId') userId: number) {
        try {
            const data = await this.adminRawTcpClient.send({
                type: 'ADMIN_RESTORE_USER',
                data: { id, adminId: userId },
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
    @ApiParam({ name: 'id', type: Number, description: 'User ID' })
    @ApiResponse({ status: 200, description: 'User roles retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async getUserRoles(@Param('id', ParseIntPipe) id: number) {
        try {
            const data = await this.adminRawTcpClient.send({
                type: 'ADMIN_GET_USER_ROLES',
                data: { id },
            });
            handlerErrorResponse(data);
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error);
        }
    }   

    @Post('users/:userId/roles')
    @ApiOperation({ summary: 'Assign roles to user' })
    @ApiParam({ name: 'userId', type: Number, description: 'User ID' })
    @ApiResponse({ status: 200, description: 'Roles assigned successfully' })
    @ApiResponse({ status: 400, description: 'Bad request - Invalid role data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async assignRolesToUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: AssignRolesDTO,
    @ActiveUser('userId') adminId: number
    ) {
    try {
        const data = await this.adminRawTcpClient.send({
        type: 'ADMIN_ASSIGN_ROLES',
        data: {
            roleIds: body.roleIds,
            userId,
            adminId,
        },
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
    @ApiParam({ name: 'id', type: Number, description: 'User ID' })
    @ApiResponse({ status: 200, description: 'User activity logs retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async getUserActivity(@Param('id', ParseIntPipe) id: number) {
        try {
            const data = await this.adminRawTcpClient.send({
                type: 'ADMIN_GET_USER_ACTIVITY',
                data: { id },
            });
            handlerErrorResponse(data);
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error);
        }
    }

    // === ROLE MANAGEMENT ===
    
    @Get('roles')
    @ApiOperation({ summary: 'Get all roles with pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiResponse({ status: 200, description: 'List of roles retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    async getAllRoles(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
    try {
        const data = await this.adminRawTcpClient.send({
        type: 'ADMIN_GET_ROLES',
        data: { page, limit },
        });
        handlerErrorResponse(data);
        return data;
    } catch (error) {
        if (error instanceof HttpException) throw error;
        handleZodError(error);
    }
    }

    
    @Post('roles')
async createRole(
    @Body() body: CreateRoleDTO,
    @ActiveUser('userId') userId: number
) {
    try {
        const data = await this.adminRawTcpClient.send({
            type: 'ADMIN_CREATE_ROLE',
            data: {
                name: body.name,
                adminId: userId,
            },
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
    @ApiParam({ name: 'id', type: Number, description: 'Role ID' })
    @ApiResponse({ status: 200, description: 'Role retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    @ApiResponse({ status: 404, description: 'Role not found' })
    async getRoleById(@Param('id', ParseIntPipe) id: number) {
        try {
            const data = await this.adminRawTcpClient.send({
                type: 'ADMIN_GET_ROLE_BY_ID',
                data: { id },
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
    @ApiParam({ name: 'id', type: Number, description: 'Role ID' })
    @ApiResponse({ status: 200, description: 'Role updated successfully' })
    @ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    @ApiResponse({ status: 404, description: 'Role not found' })
    async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateRoleDTO,
    @ActiveUser('userId') userId: number
    ) {
    try {
        const data = await this.adminRawTcpClient.send({
        type: 'ADMIN_UPDATE_ROLE',
        data: {
            id,
            ...(body.name && { name: body.name }),
            adminId: userId,
        },
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
    @ApiParam({ name: 'id', type: Number, description: 'Role ID' })
    @ApiResponse({ status: 200, description: 'Role deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    @ApiResponse({ status: 404, description: 'Role not found' })
    @ApiResponse({ status: 409, description: 'Conflict - Role is in use' })
    async deleteRole(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser('userId') userId: number
    ) {
    try {
        const data = await this.adminRawTcpClient.send({
        type: 'ADMIN_DELETE_ROLE',
        data: { id, adminId: userId },
        });
        handlerErrorResponse(data);
        return data;
    } catch (error) {
        if (error instanceof HttpException) throw error;
        handleZodError(error);
    }
    }

    @Get('roles/:id/permissions')
    @ApiOperation({ summary: 'Get permissions by role with pagination' })
    @ApiParam({ name: 'id', type: Number, description: 'Role ID' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiResponse({ status: 200, description: 'Role permissions retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    @ApiResponse({ status: 404, description: 'Role not found' })
    async getPermissionsByRole(
    @Param('id', ParseIntPipe) id: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
    try {
        const data = await this.adminRawTcpClient.send({
        type: 'ADMIN_GET_PERMISSIONS_BY_ROLE',
        data: {
            id,
            page,
            limit,
        },
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
    @ApiParam({ name: 'roleId', type: Number, description: 'Role ID' })
    @ApiResponse({ status: 200, description: 'Permissions assigned successfully' })
    @ApiResponse({ status: 400, description: 'Bad request - Invalid permission data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    @ApiResponse({ status: 404, description: 'Role not found' })
    async assignPermissionsToRole(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Body() body: AssignPermissionsToRoleDTO,
    @ActiveUser('userId') userId: number
    ) {
    try {
        const data = await this.adminRawTcpClient.send({
        type: 'ADMIN_ASSIGN_PERMISSIONS_TO_ROLE',
        data: {
            permissionIds: body.permissionIds, 
            roleId,
            adminId: userId,
        },
        });
        handlerErrorResponse(data);
        return data;
    } catch (error) {
        if (error instanceof HttpException) throw error;
        handleZodError(error);
    }
    }

    // === PERMISSIONS ===
    
    @Get('permissions')
    @ApiOperation({ summary: 'Get all permissions (with pagination)' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiResponse({ status: 200, description: 'List of permissions retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    async getAllPermissions(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
    try {
        const data = await this.adminRawTcpClient.send({
        type: 'ADMIN_GET_PERMISSIONS',
        data: { page, limit },
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
    @ApiResponse({ status: 200, description: 'User statistics retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
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
    @ApiResponse({ status: 200, description: 'Role statistics retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
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

    // === REPORTS ===
    
    @Get('reports/monthly')
    @ApiOperation({ summary: 'Get monthly report' })
    @ApiQuery({ name: 'month', required: true, type: Number, description: 'Month (1-12)' })
    @ApiQuery({ name: 'year', required: true, type: Number, description: 'Year (e.g., 2024)' })
    @ApiResponse({ status: 200, description: 'Monthly report retrieved successfully' })
    @ApiResponse({ status: 400, description: 'Bad request - Invalid month or year' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    async getMonthlyReport(
    @Query('month', ParseIntPipe) month: number,
    @Query('year', ParseIntPipe) year: number,
    @ActiveUser('userId') userId: number
    ) {
    try {
        const data = await this.adminRawTcpClient.send({
        type: 'ADMIN_GET_MONTHLY_REPORT',
        data: {
            month,
            year,
            adminId: userId,
        },
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
    @ApiQuery({ name: 'month', required: true, type: Number, description: 'Month (1-12)' })
    @ApiQuery({ name: 'year', required: true, type: Number, description: 'Year (e.g., 2024)' })
    @ApiResponse({ status: 200, description: 'PDF report generated successfully' })
    @ApiResponse({ status: 400, description: 'Bad request - Invalid month or year' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    async exportMonthlyPDF(
    @Query('month', ParseIntPipe) month: number,
    @Query('year', ParseIntPipe) year: number,
    @ActiveUser('userId') userId: number
    ) {
    try {
        const data = await this.adminRawTcpClient.send({
        type: 'ADMIN_EXPORT_MONTHLY_PDF',
        data: {
            month,
            year,
            adminId: userId,
        },
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
    @ApiQuery({ name: 'startMonth', required: true, type: Number, description: 'Start month (1-12)' })
    @ApiQuery({ name: 'startYear', required: true, type: Number, description: 'Start year (e.g., 2024)' })
    @ApiQuery({ name: 'endMonth', required: true, type: Number, description: 'End month (1-12)' })
    @ApiQuery({ name: 'endYear', required: true, type: Number, description: 'End year (e.g., 2024)' })
    @ApiResponse({ status: 200, description: 'Multi-month PDF report generated successfully' })
    @ApiResponse({ status: 400, description: 'Bad request - Invalid date range' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    async exportMultiMonthsPDF(
    @Query('startMonth', ParseIntPipe) startMonth: number,
    @Query('startYear', ParseIntPipe) startYear: number,
    @Query('endMonth', ParseIntPipe) endMonth: number,
    @Query('endYear', ParseIntPipe) endYear: number,
    @ActiveUser('userId') userId: number
    ) {
    try {
        const data = await this.adminRawTcpClient.send({
        type: 'ADMIN_EXPORT_MULTI_MONTHS_PDF',
        data: {
            startMonth,
            startYear,
            endMonth,
            endYear,
            adminId: userId,
        },
        });
        handlerErrorResponse(data);
        return data;
    } catch (error) {
        if (error instanceof HttpException) throw error;
        handleZodError(error);
    }
    }
}