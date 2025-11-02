import type { Tarea, TareaDto } from '../domain/tarea.js'
import { NotFoundError } from '../errors/errors.js'
import { tareaRepository } from '../repository/tareaRepository.js'
import { usuarioRepository } from '../repository/usuarioRepository.js'

export interface PageTareas {
  page: number
  hasMore: boolean
  data: TareaDto[]
}

class TareasService {
  async getTareaById(id: number) {
    const tarea = await tareaRepository.getTareaById(id)
    if (!tarea) throw new NotFoundError(`Tarea ${id} no encontrada`)
    return tarea.toDto()
  }

  async getTareas(page: number, limit: number): Promise<PageTareas> {
    const allTareas = await tareaRepository.getTareas()
    const toDTO = (tarea: Tarea) => tarea.toDto()
    if (limit === 0) return { page, hasMore: false, data: allTareas.map(toDTO) }
    const queryLimit = limit + 1
    const startIndex = (page - 1) * limit
    const allData = await tareaRepository.getTareas()
    const dataConExtra = allData.slice(startIndex, startIndex + queryLimit)
    const hasMore = dataConExtra.length > limit
    const dataPaginada = allTareas.slice((page - 1) * limit, page * limit)
    return { page, hasMore, data: dataPaginada.map(toDTO) }
  }

  async updateTarea(id: number, dto: TareaDto): Promise<TareaDto> {
    const tarea = await tareaRepository.getTareaById(id)
    if (!tarea) {
      throw new NotFoundError(`Tarea ${id} no encontrada`)
    }
    tarea.descripcion = dto.descripcion
    tarea.iteracion = dto.iteracion
    if (dto.asignadoA) {
      const nuevoAsignatario = await usuarioRepository.getUsuarioByNombre(dto.asignadoA)
      if (!nuevoAsignatario) throw new NotFoundError(`Usuario ${dto.asignadoA} no encontrado`)
      tarea.asignatario = nuevoAsignatario
    }
    tarea.fecha = new Date(dto.fecha)
    tarea.porcentajeCumplimiento = dto.porcentajeCumplimiento
    tareaRepository.updateTarea(tarea)
    return tarea.toDto()
  }
}

export const tareasService = new TareasService()
