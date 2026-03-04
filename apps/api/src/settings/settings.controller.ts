import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('settings')
export class SettingsController {
  constructor(private settings: SettingsService) {}

  @Get()
  get() {
    return this.settings.get();
  }

  @UseGuards(AuthGuard)
  @Patch()
  update(@Body() dto: UpdateSettingsDto) {
    return this.settings.update(dto);
  }
}
