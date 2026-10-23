import { Injectable, NotFoundException } from '@nestjs/common'
import type { TareaDto, Usuario } from '../domain/tarea.js'
import { Tarea } from '../domain/tarea.js'
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
    const startIndex = (page - 1) * limit
    const dataConExtra = allTareas.slice(startIndex, startIndex + limit + 1)
    const hasMore = dataConExtra.length > limit
    return { page, hasMore, data: dataConExtra.slice(0, limit).map(toDTO) }
  }

  async updateTarea(id: number, dto: TareaDto): Promise<TareaDto> {
    const tarea = await this.tareaRepository.getTareaById(id)
    if (!tarea) {
      throw new NotFoundException(`Tarea ${id} no encontrada`)
    }
    tarea.actualizarDesde(dto, await this.resolverAsignatario(dto.asignadoA))
    this.tareaRepository.updateTarea(tarea)
    return tarea.toDto()
  }

  async createTarea(dto: TareaDto): Promise<TareaDto> {
    const nuevaTarea = new Tarea()
    nuevaTarea.actualizarDesde(
      dto,
      await this.resolverAsignatario(dto.asignadoA)
    )
    const tareaCreada = await this.tareaRepository.createTarea(nuevaTarea)
    return tareaCreada.toDto()
  }

  async deleteTarea(id: number): Promise<void> {
    await this.tareaRepository.deleteTarea(id)
  }

  private async resolverAsignatario(
    nombre: string | undefined
  ): Promise<Usuario | null> {
    if (!nombre) return null
    const asignatario = await this.usuarioRepository.getUsuarioByNombre(nombre)
    if (!asignatario)
      throw new NotFoundException(`Usuario ${nombre} no encontrado`)
    return asignatario
  }
}
