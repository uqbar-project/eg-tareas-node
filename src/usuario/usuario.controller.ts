import { Controller, Get } from '@nestjs/common'
import { UsuariosService } from './usuario.service.js'

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  async getUsuarios() {
    return this.usuariosService.getUsuarios()
  }
}
