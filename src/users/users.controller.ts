import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
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

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  findAll() { return this.usersService.findAll(); }

  @Patch('me')
  updateMe(@Request() req, @Body() body: any) {
    // Only allow safe fields
    const allowed = { name: body.name, phone: body.phone, city: body.city, nationalId: body.nationalId };
    const data = Object.fromEntries(Object.entries(allowed).filter(([, v]) => v !== undefined));
    return this.usersService.update(req.user.sub, data);
  }
}
