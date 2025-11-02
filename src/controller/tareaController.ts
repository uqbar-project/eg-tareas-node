import type { TareaDto } from '../domain/tarea.js'
import { tareasService, type PageTareas } from '../service/tareaService.js'

export const getTareas = async (_page: string = '1', _limit: string = '0'): Promise<PageTareas> => {
  const page = +_page || 1
  const limit = +_limit || 0
  return tareasService.getTareas(page, limit)
}

export const updateTarea = async (id: string, dto: TareaDto): Promise<TareaDto | undefined> =>
  tareasService.updateTarea(+id, dto)
