import { usuarioRepository } from '../repository/usuarioRepository.js'

export const getUsuarios = async () => usuarioRepository.getUsuarios()
