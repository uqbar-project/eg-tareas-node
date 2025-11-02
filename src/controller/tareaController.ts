import type { TareaDto } from '../domain/tarea.js'
import { tareasService } from '../service/tareaService.js'

export const getTareaById = async (id: string) => tareasService.getTareaById(+id)

export const getTareas = async (_page: string = '1', _limit: string = '0') => {
  const page = +_page || 1
  const limit = +_limit || 0
  return tareasService.getTareas(page, limit)
}

export const updateTarea = async (id: string, dto: TareaDto) =>
  tareasService.updateTarea(+id, dto)
