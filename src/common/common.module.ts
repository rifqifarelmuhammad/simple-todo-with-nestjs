import { Module, Global } from '@nestjs/common';
import { ResponseUtil } from './utils/response.util';

@Global()
@Module({
    providers: [
        ResponseUtil,
    ],
    exports: [
        ResponseUtil,
    ]
})
export class CommonModule {}
