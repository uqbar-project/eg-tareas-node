import type { TareaDto } from '../domain/tarea.js'
import { NotFoundError } from '../errors/errors.js'
import { tareaRepository } from '../repository/tareaRepository.js'

export interface PageTareas {
  page: number
  total: number
  data: TareaDto[]
}

class TareasService {
  async getTareas(page: number, limit: number): Promise<PageTareas> {
    const data = await tareaRepository.getTareas()
    const total = data.length
    const dataPaginada = data.slice((page - 1) * limit, page * limit)
    return { page, total, data: dataPaginada }
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
