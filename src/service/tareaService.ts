import type { TareaDto } from '../domain/tarea.js'
import { NotFoundError } from '../errors/errors.js'
import { tareaRepository } from '../repository/tareaRepository.js'

export interface PageTareas {
  page: number
  hasMore: boolean
  data: TareaDto[]
}

class TareasService {
  async getTareas(page: number, limit: number): Promise<PageTareas> {
    const data = await tareaRepository.getTareas()
    if (limit === 0) return { page, hasMore: false, data }
    const queryLimit = limit + 1
    const startIndex = (page - 1) * limit
    const allData = await tareaRepository.getTareas()
    const dataConExtra = allData.slice(startIndex, startIndex + queryLimit)
    const hasMore = dataConExtra.length > limit
    const dataPaginada = data.slice((page - 1) * limit, page * limit)
    return { page, hasMore, data: dataPaginada }
  }

  async updateTarea(id: number, dto: TareaDto): Promise<TareaDto> {
    const tarea = await tareaRepository.getTareaById(id)
    if (!tarea) {
      throw new NotFoundError(`Tarea ${id} no encontrada`)
    }
    tarea.descripcion = dto.descripcion
    tarea.iteracion = dto.iteracion
    tarea.asignatario = dto.asignatario
    tarea.fecha = dto.fecha
    tarea.porcentajeCumplimiento = dto.porcentajeCumplimiento
    return tarea
  }
}

export const tareasService = new TareasService()
