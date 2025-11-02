import { usuarioRepository } from '../repository/usuarioRepository.js'

class UsuariosService {
  async getUsuarios() {
    return usuarioRepository.getUsuarios()
  }
}

export const usuariosService = new UsuariosService()
