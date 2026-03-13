import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
export declare class SettingsController {
    private settings;
    constructor(settings: SettingsService);
    get(): Promise<any>;
    update(dto: UpdateSettingsDto): Promise<any>;
}
