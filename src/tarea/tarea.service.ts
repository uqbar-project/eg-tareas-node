import { Injectable, NotFoundException } from '@nestjs/common'
import { parse } from 'date-fns'
import type { Tarea, TareaDto } from '../domain/tarea.js'
import { UsuarioRepository } from '../usuario/usuario.repository.js'
import { TareaRepository } from './tarea.repository.js'

export interface PageTareas {
  page: number
  hasMore: boolean
  data: TareaDto[]
}

@Injectable()
export class TareasService {
  constructor(
    private readonly tareaRepository: TareaRepository,
    private readonly usuarioRepository: UsuarioRepository
  ) {}

  async getTareaById(id: number) {
    const tarea = await this.tareaRepository.getTareaById(id)
    if (!tarea) throw new NotFoundException(`Tarea ${id} no encontrada`)
    return tarea.toDto()
  }

  async getTareas(page: number, limit: number): Promise<PageTareas> {
    const allTareas = await this.tareaRepository.getTareas()
    const toDTO = (tarea: Tarea) => tarea.toDto()
    if (limit === 0) return { page, hasMore: false, data: allTareas.map(toDTO) }
    const queryLimit = limit + 1
    const startIndex = (page - 1) * limit
    const allData = await this.tareaRepository.getTareas()
    const dataConExtra = allData.slice(startIndex, startIndex + queryLimit)
    const hasMore = dataConExtra.length > limit
    const dataPaginada = allTareas.slice((page - 1) * limit, page * limit)
    return { page, hasMore, data: dataPaginada.map(toDTO) }
  }

  async updateTarea(id: number, dto: TareaDto): Promise<TareaDto> {
    const tarea = await this.tareaRepository.getTareaById(id)
    if (!tarea) {
      throw new NotFoundException(`Tarea ${id} no encontrada`)
    }
    tarea.descripcion = dto.descripcion
    tarea.iteracion = dto.iteracion
    if (dto.asignadoA) {
      const nuevoAsignatario = await this.usuarioRepository.getUsuarioByNombre(
        dto.asignadoA
      )
      if (!nuevoAsignatario)
        throw new NotFoundException(`Usuario ${dto.asignadoA} no encontrado`)
      tarea.asignatario = nuevoAsignatario
    }
    tarea.fecha = parse(dto.fecha, 'dd/MM/yyyy', new Date())
    tarea.porcentajeCumplimiento = dto.porcentajeCumplimiento
    this.tareaRepository.updateTarea(tarea)
    return tarea.toDto()
  }
}
