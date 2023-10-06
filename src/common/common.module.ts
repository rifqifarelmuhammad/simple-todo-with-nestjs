import { Module, Global } from '@nestjs/common'
import { ResponseUtil } from './utils/response.util'
import { GetFinalizeUserUtil } from './utils/getFinalizeUser.util'

@Global()
@Module({
  providers: [ResponseUtil, GetFinalizeUserUtil],
  exports: [ResponseUtil, GetFinalizeUserUtil],
})
export class CommonModule {}
