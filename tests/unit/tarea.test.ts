import { beforeEach, describe, expect, it } from 'vitest'
import { Tarea, Usuario } from '../../src/domain/tarea.js'

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

    it('should throw when porcentajeCumplimiento is NaN', () => {
      tarea.porcentajeCumplimiento = NaN
      expect(() => tarea.validar()).toThrow(
        'El porcentaje de cumplimiento debe estar entre 0 y 100'
      )
    })

    it('should throw when porcentajeCumplimiento is Infinity', () => {
      tarea.porcentajeCumplimiento = Infinity
      expect(() => tarea.validar()).toThrow(
        'El porcentaje de cumplimiento debe estar entre 0 y 100'
      )
    })

    it('should throw when fecha is invalid', () => {
      tarea.fecha = new Date('invalid')
      expect(() => tarea.validar()).toThrow('La fecha debe ser válida')
    })
  })

  describe('clonar', () => {
    it('should return a Tarea instance with the same fields', () => {
      tarea.id = 7
      tarea.iteracion = 'Sprint 1'
      tarea.asignatario = new Usuario()
      const clon = tarea.clonar()
      expect(clon).toBeInstanceOf(Tarea)
      expect(clon).not.toBe(tarea)
      expect(clon).toEqual(tarea)
    })

    it('should not propagate changes made on the clone to the original', () => {
      const clon = tarea.clonar()
      clon.descripcion = 'Modificada en el clon'
      clon.porcentajeCumplimiento = 99
      expect(tarea.descripcion).toBe('Tarea de prueba')
      expect(tarea.porcentajeCumplimiento).toBe(50)
    })
  })

  describe('actualizarDesde', () => {
    const dto = {
      id: 0,
      descripcion: 'Descripción nueva',
      iteracion: 'Sprint 2',
      asignadoA: undefined,
      fecha: '24/06/2026',
      porcentajeCumplimiento: 80,
    }

    it('should copy every field from dto and parse fecha as dd/MM/yyyy', () => {
      tarea.actualizarDesde(dto, null)
      expect(tarea.descripcion).toBe('Descripción nueva')
      expect(tarea.iteracion).toBe('Sprint 2')
      expect(tarea.porcentajeCumplimiento).toBe(80)
      expect(tarea.fecha.getFullYear()).toBe(2026)
      expect(tarea.fecha.getMonth()).toBe(5)
      expect(tarea.fecha.getDate()).toBe(24)
    })

    it('should set the given asignatario', () => {
      const usuario = new Usuario()
      usuario.nombre = 'Ana'
      tarea.actualizarDesde(dto, usuario)
      expect(tarea.asignatario).toBe(usuario)
    })

    it('should clear the previous asignatario when null is given', () => {
      tarea.asignatario = new Usuario()
      tarea.actualizarDesde(dto, null)
      expect(tarea.asignatario).toBeNull()
    })

    it('should validate after copying', () => {
      expect(() =>
        tarea.actualizarDesde({ ...dto, porcentajeCumplimiento: 150 }, null)
      ).toThrow('El porcentaje de cumplimiento debe estar entre 0 y 100')
    })

    it('should throw when fecha has an invalid format', () => {
      expect(() =>
        tarea.actualizarDesde({ ...dto, fecha: '2026-06-24' }, null)
      ).toThrow('La fecha debe ser válida')
    })
  })
})
