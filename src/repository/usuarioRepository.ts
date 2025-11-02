import { Usuario } from '../domain/tarea.js'
import { faker } from '@faker-js/faker/locale/es' // Usamos faker en español

const crearUsuarioFalso = (): Usuario => {
  const usuario = new Usuario()
  usuario.id = faker.string.uuid()
  usuario.nombre = faker.person.fullName()
  usuario.email = faker.internet.email()
  return usuario
}

const generarUsuarios = (cantidad: number = 50) =>
  Array.from({ length: cantidad }, crearUsuarioFalso)

class UsuarioRepository {
  constructor(private usuarios: Usuario[] = generarUsuarios()) {}

  async getAnyUsuario() {
    const randomNumber = Math.trunc(Math.random() * this.usuarios.length)
    return this.usuarios[randomNumber]!
  }

  async getUsuarios() {
    return this.usuarios.sort((u1, u2) => u1.nombre.localeCompare(u2.nombre))
  }

  async getUsuarioByNombre(nombre: string) {
    return this.usuarios.find((usuario: Usuario) => usuario.nombre.toLowerCase() == nombre.toLowerCase())
  }
}

export const usuarioRepository = new UsuarioRepository()
