import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { DomainErrorFilter } from './common/filters/domain-error.filter.js'
import { TareaModule } from './tarea/tarea.module.js'
import { UsuarioModule } from './usuario/usuario.module.js'

@Module({
  imports: [TareaModule, UsuarioModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: DomainErrorFilter,
    },
  ],
})
export class AppModule {}
