import { faker } from '@faker-js/faker/locale/es'
import { Injectable } from '@nestjs/common'
import { Usuario } from '../domain/tarea.js'

const crearUsuarioFalso = (): Usuario => {
  const usuario = new Usuario()
  usuario.id = faker.string.uuid()
  usuario.nombre = faker.person.fullName()
  usuario.email = faker.internet.email()
  return usuario
}

const generarUsuarios = (cantidad: number = 50) =>
  Array.from({ length: cantidad }, crearUsuarioFalso)

@Injectable()
export class UsuarioRepository {
  private usuarios: Usuario[] = generarUsuarios()

  getRandomUsuario(): Usuario | undefined {
    if (this.usuarios.length === 0) return undefined
    const randomNumber = Math.trunc(Math.random() * this.usuarios.length)
    return this.usuarios[randomNumber]
  }

  async getAnyUsuario() {
    const usuario = this.getRandomUsuario()
    if (!usuario) throw new Error('Empty user list')
    return usuario
  }

  async getUsuarios() {
    return this.usuarios.sort((u1, u2) => u1.nombre.localeCompare(u2.nombre))
  }

  async getUsuarioByNombre(nombre: string) {
    return this.usuarios.find(
      (usuario: Usuario) =>
        usuario.nombre.toLowerCase() === nombre.toLowerCase()
    )
  }
}
