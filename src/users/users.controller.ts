import { Controller, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  /* Admin: list all users */
  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  findAll() { return this.usersService.findAll(); }

  /* Admin: list managers only */
  @Get('managers')
  @UseGuards(RolesGuard)
  @Roles('admin')
  findManagers() { return this.usersService.findByRole('manager'); }

  /* Logged-in user: update own profile */
  @Patch('me')
  updateMe(@Request() req, @Body() body: any) {
    const allowed: any = {};
    if (body.name       !== undefined) allowed.name       = body.name;
    if (body.phone      !== undefined) allowed.phone      = body.phone;
    if (body.city       !== undefined) allowed.city       = body.city;
    if (body.nationalId !== undefined) allowed.nationalId = body.nationalId;
    return this.usersService.update(req.user.sub, allowed);
  }

  /* Admin: update any user (role, name, etc.) */
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  updateUser(@Param('id') id: string, @Body() body: any) {
    const allowed: any = {};
    if (body.role       !== undefined) allowed.role       = body.role;
    if (body.name       !== undefined) allowed.name       = body.name;
    if (body.phone      !== undefined) allowed.phone      = body.phone;
    if (body.city       !== undefined) allowed.city       = body.city;
    if (body.nationalId !== undefined) allowed.nationalId = body.nationalId;
    return this.usersService.update(id, allowed);
  }
}
