import { Module } from '@nestjs/common'
import { UsuarioModule } from '../usuario/usuario.module.js'
import { TareaController } from './tarea.controller.js'
import { TareaRepository } from './tarea.repository.js'
import { TareasService } from './tarea.service.js'

@Module({
  imports: [UsuarioModule],
  controllers: [TareaController],
  providers: [TareasService, TareaRepository],
})
export class TareaModule {}
