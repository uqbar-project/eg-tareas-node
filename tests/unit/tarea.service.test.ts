import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Test, type TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it } from 'vitest'
import type { Tarea, Usuario } from '../../src/domain/tarea.js'
import { TareaModule } from '../../src/tarea/tarea.module.js'
import { TareaRepository } from '../../src/tarea/tarea.repository.js'
import { TareasService } from '../../src/tarea/tarea.service.js'
import { UsuarioModule } from '../../src/usuario/usuario.module.js'
import { UsuarioRepository } from '../../src/usuario/usuario.repository.js'

describe('TareasService', () => {
  let service: TareasService
  let tareaRepo: TareaRepository
  let usuarioRepo: UsuarioRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TareaModule, UsuarioModule],
    }).compile()
    service = module.get(TareasService)
    tareaRepo = module.get(TareaRepository)
    usuarioRepo = module.get(UsuarioRepository)
  })

  describe('getTareaById', () => {
    it('should throw NotFoundException for non-existent task', async () => {
      await expect(service.getTareaById(999999)).rejects.toThrow(
        NotFoundException
      )
    })
  })

  describe('getTareas', () => {
    it('should return all tasks when limit is 0', async () => {
      const result = await service.getTareas(1, 0)
      expect(result.hasMore).toBe(false)
      expect(result.data.length).toBeGreaterThan(0)
    })

    it('should paginate with hasMore', async () => {
      const result = await service.getTareas(1, 10)
      const total = (await tareaRepo.getTareas()).length
      expect(result.page).toBe(1)
      expect(result.data.length).toBeLessThanOrEqual(10)
      expect(result.hasMore).toBe(total > 10)
    })
  })

  describe('updateTarea', () => {
    it('should throw NotFoundException when task does not exist', async () => {
      const dto = {
        id: 999999,
        descripcion: 'test',
        iteracion: 'Sprint 1',
        asignadoA: undefined,
        fecha: '24/06/2026',
        porcentajeCumplimiento: 50,
      }
      await expect(service.updateTarea(999999, dto)).rejects.toThrow(
        NotFoundException
      )
    })

    it('should throw NotFoundException when asignadoA does not exist', async () => {
      const tareas = await tareaRepo.getTareas()
      const tarea = tareas[0] as Tarea
      const dto = {
        id: tarea.id,
        descripcion: 'test',
        iteracion: 'Sprint 1',
        asignadoA: 'NonExistentUser',
        fecha: '24/06/2026',
        porcentajeCumplimiento: 50,
      }
      await expect(service.updateTarea(tarea.id, dto)).rejects.toThrow(
        NotFoundException
      )
    })

    it('should update task with valid asignadoA', async () => {
      const tareas = await tareaRepo.getTareas()
      const tarea = tareas[0] as Tarea
      const usuarios = await usuarioRepo.getUsuarios()
      const usuario = usuarios[0] as Usuario

      const dto = {
        id: tarea.id,
        descripcion: 'Descripción actualizada',
        iteracion: 'Sprint 5',
        asignadoA: usuario.nombre,
        fecha: '24/06/2026',
        porcentajeCumplimiento: 75,
      }
      const result = await service.updateTarea(tarea.id, dto)
      expect(result.descripcion).toBe('Descripción actualizada')
      expect(result.iteracion).toBe('Sprint 5')
      expect(result.asignadoA).toBe(usuario.nombre)
      expect(result.porcentajeCumplimiento).toBe(75)
    })

    it('should keep the stored task untouched when the dto is invalid', async () => {
      const tareas = await tareaRepo.getTareas()
      const tarea = tareas[0] as Tarea
      const descripcionOriginal = tarea.descripcion
      const porcentajeOriginal = tarea.porcentajeCumplimiento
      const dto = {
        id: tarea.id,
        descripcion: 'Descripcion rechazada',
        iteracion: 'Sprint 9',
        asignadoA: undefined,
        fecha: '24/06/2026',
        porcentajeCumplimiento: 150,
      }
      await expect(service.updateTarea(tarea.id, dto)).rejects.toThrow(
        BadRequestException
      )

      const almacenada = await service.getTareaById(tarea.id)
      expect(almacenada.descripcion).toBe(descripcionOriginal)
      expect(almacenada.porcentajeCumplimiento).toBe(porcentajeOriginal)
    })

    it('should update task without asignadoA', async () => {
      const tareas = await tareaRepo.getTareas()
      const tarea = tareas[0] as Tarea
      const dto = {
        id: tarea.id,
        descripcion: 'Sin asignatario',
        iteracion: 'Sprint 3',
        asignadoA: undefined,
        fecha: '24/06/2026',
        porcentajeCumplimiento: 30,
      }
      const result = await service.updateTarea(tarea.id, dto)
      expect(result.descripcion).toBe('Sin asignatario')
      expect(result.asignadoA).toBeUndefined()
    })
  })

  describe('deleteTarea', () => {
    it('should throw NotFoundException when task does not exist', async () => {
      await expect(service.deleteTarea(999999)).rejects.toThrow(
        NotFoundException
      )
    })

    it('should delete an existing task', async () => {
      const tareas = await tareaRepo.getTareas()
      const tarea = tareas[0] as Tarea
      await service.deleteTarea(tarea.id)
      await expect(service.getTareaById(tarea.id)).rejects.toThrow(
        NotFoundException
      )
    })
  })

  describe('createTarea', () => {
    it('should throw NotFoundException when asignadoA does not exist', async () => {
      const dto = {
        id: 0,
        descripcion: 'Nueva tarea',
        iteracion: 'Sprint 1',
        asignadoA: 'NonExistentUser',
        fecha: '24/06/2026',
        porcentajeCumplimiento: 0,
      }
      await expect(service.createTarea(dto)).rejects.toThrow(NotFoundException)
    })

    it('should create task with valid asignadoA', async () => {
      const usuarios = await usuarioRepo.getUsuarios()
      const usuario = usuarios[0] as Usuario
      const dto = {
        id: 0,
        descripcion: 'Nueva tarea',
        iteracion: 'Sprint 1',
        asignadoA: usuario.nombre,
        fecha: '24/06/2026',
        porcentajeCumplimiento: 10,
      }
      const result = await service.createTarea(dto)
      expect(result.id).toBeGreaterThan(0)
      expect(result.descripcion).toBe('Nueva tarea')
      expect(result.asignadoA).toBe(usuario.nombre)
      expect(result.fecha).toBe('24/06/2026')
    })

    it('should create task without asignadoA', async () => {
      const dto = {
        id: 0,
        descripcion: 'Sin asignatario',
        iteracion: 'Sprint 1',
        asignadoA: undefined,
        fecha: '24/06/2026',
        porcentajeCumplimiento: 0,
      }
      const result = await service.createTarea(dto)
      expect(result.asignadoA).toBeUndefined()
    })

    it('should throw BadRequestException when dto is invalid', async () => {
      const dto = {
        id: 0,
        descripcion: '',
        iteracion: 'Sprint 1',
        asignadoA: undefined,
        fecha: '24/06/2026',
        porcentajeCumplimiento: 0,
      }
      await expect(service.createTarea(dto)).rejects.toThrow(
        BadRequestException
      )
    })
  })
})
