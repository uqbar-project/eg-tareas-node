import { beforeEach, describe, expect, it } from 'vitest'
import { Tarea } from '../../src/domain/tarea.js'

describe('Tarea', () => {
  let tarea: Tarea

  beforeEach(() => {
    tarea = new Tarea()
    tarea.descripcion = 'Tarea de prueba'
    tarea.porcentajeCumplimiento = 50
    tarea.fecha = new Date('2026-06-25')
  })

  describe('validar', () => {
    it('should not throw for valid tarea', () => {
      expect(() => tarea.validar()).not.toThrow()
    })

    it('should throw when descripcion is empty', () => {
      tarea.descripcion = ''
      expect(() => tarea.validar()).toThrow(
        'La descripción no puede estar vacía'
      )
    })

    it('should throw when descripcion is only whitespace', () => {
      tarea.descripcion = '   '
      expect(() => tarea.validar()).toThrow(
        'La descripción no puede estar vacía'
      )
    })

    it('should throw when porcentajeCumplimiento is less than 0', () => {
      tarea.porcentajeCumplimiento = -1
      expect(() => tarea.validar()).toThrow(
        'El porcentaje de cumplimiento debe estar entre 0 y 100'
      )
    })

    it('should throw when porcentajeCumplimiento is greater than 100', () => {
      tarea.porcentajeCumplimiento = 101
      expect(() => tarea.validar()).toThrow(
        'El porcentaje de cumplimiento debe estar entre 0 y 100'
      )
    })

    it('should not throw when porcentajeCumplimiento is 0', () => {
      tarea.porcentajeCumplimiento = 0
      expect(() => tarea.validar()).not.toThrow()
    })

    it('should not throw when porcentajeCumplimiento is 100', () => {
      tarea.porcentajeCumplimiento = 100
      expect(() => tarea.validar()).not.toThrow()
    })

    it('should throw when fecha is invalid', () => {
      tarea.fecha = new Date('invalid')
      expect(() => tarea.validar()).toThrow('La fecha debe ser válida')
    })
  })
})
