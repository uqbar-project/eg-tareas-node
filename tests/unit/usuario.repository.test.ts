import { Test, type TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it } from 'vitest'
import type { Usuario } from '../../src/domain/tarea.js'
import { UsuarioModule } from '../../src/usuario/usuario.module.js'
import { UsuarioRepository } from '../../src/usuario/usuario.repository.js'

describe('UsuarioRepository', () => {
  let repo: UsuarioRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsuarioModule],
    }).compile()
    repo = module.get(UsuarioRepository)
  })

  describe('getUsuarios', () => {
    it('should return a sorted array of users', async () => {
      const usuarios = await repo.getUsuarios()
      expect(usuarios.length).toBeGreaterThan(0)
      for (let i = 1; i < usuarios.length; i++) {
        const current = usuarios[i] as Usuario
        const previous = usuarios[i - 1] as Usuario
        expect(
          current.nombre.localeCompare(previous.nombre)
        ).toBeGreaterThanOrEqual(0)
      }
    })
  })

  describe('getAnyUsuario', () => {
    it('should return a random user', async () => {
      const usuario = await repo.getAnyUsuario()
      expect(usuario).toBeDefined()
      expect(usuario.id).toBeTruthy()
      expect(usuario.nombre).toBeTruthy()
    })
  })

  describe('getUsuarioByNombre', () => {
    it('should find a user by name (case insensitive)', async () => {
      const usuarios = await repo.getUsuarios()
      const primerUsuario = usuarios[0] as Usuario
      const found = await repo.getUsuarioByNombre(
        primerUsuario.nombre.toUpperCase()
      )
      expect(found).toBeDefined()
      expect(found?.nombre.toLowerCase()).toBe(
        primerUsuario.nombre.toLowerCase()
      )
    })

    it('should return undefined when user is not found', async () => {
      const found = await repo.getUsuarioByNombre('NonExistentUserXYZ123!')
      expect(found).toBeUndefined()
    })
  })
})
