import { Module } from '@nestjs/common'
import { UsuarioController } from './usuario.controller.js'
import { UsuarioRepository } from './usuario.repository.js'
import { UsuariosService } from './usuario.service.js'

@Module({
  controllers: [UsuarioController],
  providers: [UsuariosService, UsuarioRepository],
  exports: [UsuarioRepository],
})
export class UsuarioModule {}
