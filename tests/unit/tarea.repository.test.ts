import { Test, type TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it } from 'vitest'
import type { Tarea } from '../../src/domain/tarea.js'
import { TareaModule } from '../../src/tarea/tarea.module.js'
import { TareaRepository } from '../../src/tarea/tarea.repository.js'
import { UsuarioModule } from '../../src/usuario/usuario.module.js'

describe('TareaRepository', () => {
  let repo: TareaRepository
  let tareaExistente: Tarea

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TareaModule, UsuarioModule],
    }).compile()
    repo = module.get(TareaRepository)
    tareaExistente = (await repo.getTareas())[0] as Tarea
  })

  describe('getTareaById', () => {
    it('should return a different instance on every read', async () => {
      const primeraLectura = await repo.getTareaById(tareaExistente.id)
      const segundaLectura = await repo.getTareaById(tareaExistente.id)
      expect(primeraLectura).toBeDefined()
      expect(primeraLectura).not.toBe(segundaLectura)
      expect(primeraLectura).toEqual(segundaLectura)
    })

    it('should not persist changes made on the returned tarea', async () => {
      const descripcionOriginal = tareaExistente.descripcion
      const tarea = (await repo.getTareaById(tareaExistente.id)) as Tarea
      tarea.descripcion = 'Cambio que no debe persistir'

      const releida = (await repo.getTareaById(tareaExistente.id)) as Tarea
      expect(releida.descripcion).toBe(descripcionOriginal)
    })
  })

  describe('getTareas', () => {
    it('should not persist changes made on the returned tareas', async () => {
      const tareas = await repo.getTareas()
      const tarea = tareas[0] as Tarea
      tarea.descripcion = 'Cambio que no debe persistir'

      const releida = (await repo.getTareaById(tarea.id)) as Tarea
      expect(releida.descripcion).not.toBe('Cambio que no debe persistir')
    })
  })

  describe('updateTarea', () => {
    it('should persist the given tarea', async () => {
      const tarea = (await repo.getTareaById(tareaExistente.id)) as Tarea
      tarea.descripcion = 'Descripcion persistida'
      await repo.updateTarea(tarea)

      const releida = (await repo.getTareaById(tareaExistente.id)) as Tarea
      expect(releida.descripcion).toBe('Descripcion persistida')
    })
  })

  describe('deleteTarea', () => {
    it('should remove the tarea with the given id', async () => {
      const cantidadInicial = (await repo.getTareas()).length
      await repo.deleteTarea(tareaExistente.id)

      expect(await repo.getTareaById(tareaExistente.id)).toBeUndefined()
      expect((await repo.getTareas()).length).toBe(cantidadInicial - 1)
    })

    it('should leave the collection untouched when the id does not exist', async () => {
      const cantidadInicial = (await repo.getTareas()).length
      await repo.deleteTarea(999999)
      expect((await repo.getTareas()).length).toBe(cantidadInicial)
    })
  })
})
