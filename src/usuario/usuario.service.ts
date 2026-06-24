import { Injectable } from '@nestjs/common'
import { UsuarioRepository } from './usuario.repository.js'

@Injectable()
export class UsuariosService {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  async getUsuarios() {
    return this.usuarioRepository.getUsuarios()
  }
}
