import { faker } from '@faker-js/faker/locale/es'
import { Tarea } from '../domain/tarea.js'
import { usuarioRepository } from './usuarioRepository.js'

const crearTareaFalsa = async (): Promise<Tarea> => {
  const tarea = new Tarea()
  tarea.id = faker.number.int()
  tarea.descripcion = faker.lorem.sentence(5)
  tarea.iteracion = `Sprint ${faker.number.int({ min: 1, max: 4 })}`
  if (faker.datatype.boolean()) {
    tarea.asignatario = await usuarioRepository.getAnyUsuario()
  }
  tarea.fecha = faker.date.recent()
  tarea.porcentajeCumplimiento = faker.number.int({ min: 0, max: 100 })

  return tarea
}

export const generarTareas = async (cantidad: number = 10): Promise<Tarea[]> =>
  Promise.all(Array.from({ length: cantidad }, crearTareaFalsa))

class TareaRepository {
  constructor(private tareas: Tarea[] = []) {
    generarTareas(450).then((allTareas) => {
      this.tareas = allTareas
    })
  }

  async getTareas(): Promise<Tarea[]> {
    return this.tareas
  }

  async getTareaById(id: number): Promise<Tarea | undefined> {
    return this.tareas.find(tarea => tarea.id === id)
  }

  async updateTarea(tarea: Tarea) {
    const indexTarea = this.tareas.findIndex((tareaSearch: Tarea) => tareaSearch.id == tarea.id)
    this.tareas[indexTarea] = tarea
    return tarea
  }
}

export const tareaRepository = new TareaRepository()
