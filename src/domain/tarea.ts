export class Usuario {
  id: string = ''
  nombre: string = ''
  email: string = ''
}

export class Tarea {
  id: number = 0
  descripcion: string = ''
  iteracion: string = ''
  asignatario: Usuario | null = null
  fecha: Date = new Date()
  porcentajeCumplimiento: number = 0

  toDto(): TareaDto {
    return {
      id: this.id,
      descripcion: this.descripcion,
      iteracion: this.iteracion,
      asignadoA: this.asignatario?.nombre,
      fecha: this.fecha.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      porcentajeCumplimiento: this.porcentajeCumplimiento,
    }
  }

  validar(): void {
    if (!this.descripcion || this.descripcion.trim().length === 0) {
      throw new Error('La descripción no puede estar vacía')
    }
    if (this.porcentajeCumplimiento < 0 || this.porcentajeCumplimiento > 100) {
      throw new Error('El porcentaje de cumplimiento debe estar entre 0 y 100')
    }
    if (Number.isNaN(this.fecha.getTime())) {
      throw new Error('La fecha debe ser válida')
    }
  }
}

export interface TareaDto {
  id: number
  descripcion: string
  iteracion: string
  asignadoA: string | undefined
  fecha: string
  porcentajeCumplimiento: number
}
