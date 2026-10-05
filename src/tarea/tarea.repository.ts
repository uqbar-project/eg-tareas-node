import { faker } from '@faker-js/faker/locale/es'
import { Injectable, NotFoundException } from '@nestjs/common'
import type { Usuario } from '../domain/tarea.js'
import { Tarea } from '../domain/tarea.js'
import { UsuarioRepository } from '../usuario/usuario.repository.js'

let ultimoId = 1

const PROBABILIDAD_TAREA_ASIGNADA = 0.7

const crearTareaFalsa = (pickUsuario: () => Usuario | undefined): Tarea => {
  const tarea = new Tarea()
  tarea.id = ultimoId++
  tarea.descripcion = faker.lorem.sentence(5)
  tarea.iteracion = `Sprint ${faker.number.int({ min: 1, max: 4 })}`
  tarea.fecha = faker.date.recent({ days: 30 })
  tarea.porcentajeCumplimiento = faker.number.int({ min: 0, max: 100 })
  if (Math.random() < PROBABILIDAD_TAREA_ASIGNADA) {
    const usuario = pickUsuario()
    if (usuario) tarea.asignatario = usuario
  }

  return tarea
}

const generarTareas = (
  pickUsuario: () => Usuario | undefined,
  cantidad: number = 10
): Tarea[] =>
  Array.from({ length: cantidad }, () => crearTareaFalsa(pickUsuario))

@Injectable()
export class TareaRepository {
  private tareas: Tarea[]

  constructor(private readonly usuarioRepository: UsuarioRepository) {
    this.tareas = generarTareas(
      () => this.usuarioRepository.getRandomUsuario(),
      450
    )
  }

  async getTareas(): Promise<Tarea[]> {
    return this.tareas.sort((tareaA, tareaB) =>
      tareaA.descripcion.localeCompare(tareaB.descripcion)
    )
  }

  async getTareaById(id: number): Promise<Tarea | undefined> {
    return this.tareas.find(tarea => tarea.id === id)
  }

  async updateTarea(tarea: Tarea) {
    const indexTarea = this.tareas.findIndex(
      tareaSearch => tareaSearch.id === tarea.id
    )
    this.tareas[indexTarea] = tarea
    return tarea
  }

  async createTarea(tarea: Tarea): Promise<Tarea> {
    tarea.id = ultimoId++
    this.tareas.push(tarea)
    return tarea
  }

  async deleteTarea(id: number): Promise<void> {
    const indexEncontrado = this.tareas.findIndex(
      tareaPorBuscar => tareaPorBuscar.id === id
    )
    if (indexEncontrado === -1) {
      throw new NotFoundException(`Tarea ${id} no encontrada`)
    }
    this.tareas.splice(indexEncontrado, 1)
  }
}
