import { faker } from '@faker-js/faker/locale/es' // Usamos faker en español
import { Tarea, Usuario, type TareaDto } from '../domain/tarea.js' // <-- ¡Importante usar .js!

const crearUsuarioFalso = (): Usuario => {
  const usuario = new Usuario()
  usuario.id = faker.string.uuid()
  usuario.nombre = faker.person.fullName()
  usuario.email = faker.internet.email()
  return usuario
}

const crearTareaFalsa = (): Tarea => {
  const tarea = new Tarea()
  tarea.id = faker.number.int()
  tarea.descripcion = faker.lorem.sentence(5)
  tarea.iteracion = `Sprint ${faker.number.int({ min: 1, max: 4 })}`

  if (faker.datatype.boolean()) {
    tarea.asignatario = crearUsuarioFalso()
  }

  tarea.fecha = faker.date.recent()
  tarea.porcentajeCumplimiento = faker.number.int({ min: 0, max: 100 })

  return tarea
}

export const generarTareas = (cantidad: number = 10): Tarea[] => {
  return Array.from({ length: cantidad }, crearTareaFalsa)
}

class TareaRepository {
  constructor(private tareas: Tarea[] = generarTareas(450)) {}

  async getTareas(): Promise<TareaDto[]> {
    return this.tareas.map(tarea => tarea.toDto())
  }

  async getTareaById(id: number): Promise<TareaDto | undefined> {
    return this.tareas.find(tarea => tarea.id === id)?.toDto()
  }
}

export const tareaRepository = new TareaRepository()
