import type { TareaDto } from '../domain/tarea.js'
import { tareasService, type PageTareas } from '../service/tareaService.js'

export const getTareas = (_page: string = '1', _limit: string = '10'): PageTareas => {
  const page = +_page || 1
  const limit = +_limit || 10
  return tareasService.getTareas(page, limit)
}

export const updateTarea = (id: string, dto: TareaDto): TareaDto | undefined => {
  return tareasService.updateTarea(+id, dto)
}
