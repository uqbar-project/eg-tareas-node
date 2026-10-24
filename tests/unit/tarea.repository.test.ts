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

  describe('updateTarea', () => {
    it('should replace the stored task with the given one', async () => {
      const tarea = tareaExistente.clonar()
      tarea.descripcion = 'Descripcion persistida'
      await repo.updateTarea(tarea)

      const releida = (await repo.getTareaById(tareaExistente.id)) as Tarea
      expect(releida.descripcion).toBe('Descripcion persistida')
    })
  })

  describe('deleteTarea', () => {
    it('should remove the task with the given id', async () => {
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
