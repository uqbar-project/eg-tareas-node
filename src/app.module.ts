import { Module } from '@nestjs/common'
import { TareaModule } from './tarea/tarea.module.js'
import { UsuarioModule } from './usuario/usuario.module.js'

@Module({
  imports: [TareaModule, UsuarioModule],
})
export class AppModule {}
