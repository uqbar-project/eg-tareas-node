export class Usuario {
  id: string = ''
  nombre: string = ''
  email: string = ''
}

export class Tarea {
  id!: number
  descripcion: string = ''
  iteracion: string = ''
  asignatario: Usuario | null = null
  fecha: Date = new Date()
  porcentajeCumplimiento: number = 0

  toDto(): TareaDto {
    return {
      id: this.id!,
      descripcion: this.descripcion,
      iteracion: this.iteracion,
      asignatario: this.asignatario?.nombre,
      fecha: this.fecha.toLocaleDateString('es-AR'),
      porcentajeCumplimiento: this.porcentajeCumplimiento,
    }
  }
}

export interface TareaDto {
  id: number
  descripcion: string
  iteracion: string
  asignatario: string | undefined
  fecha: string
  porcentajeCumplimiento: number
}
