import { type INestApplication } from '@nestjs/common'
import { Test, type TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AppModule } from '../../src/app.module.js'
import { TareaRepository } from '../../src/tarea/tarea.repository.js'

describe('API integration tests', () => {
  let app: TestingModule
  let nestApp: INestApplication

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    nestApp = app.createNestApplication()
    await nestApp.init()
  })

  afterEach(async () => {
    await nestApp.close()
  })

  it('GET /tareas should return page and data array', async () => {
    const res = await request(nestApp.getHttpServer()).get('/tareas')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('page')
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.page).toBe(1)
  })

  it('GET /tareas should return second page and data array', async () => {
    const res = await request(nestApp.getHttpServer()).get(
      '/tareas?page=2&limit=5'
    )
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('page')
    const tasks = res.body.data
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(tasks.length).toBe(5)
    expect(res.body.page).toBe(2)
  })

  describe('GET /tareas/:id error handling', () => {
    it('should return a 404 http code for a non-existing task', async () => {
      const res = await request(nestApp.getHttpServer()).get('/tareas/999999')
      expect(res.status).toBe(404)
    })

    describe('when database fails', () => {
      beforeEach(() => {
        vi.spyOn(TareaRepository.prototype, 'getTareaById').mockImplementation(
          () => {
            throw new Error('Database connection failed')
          }
        )
      })

      afterEach(() => {
        vi.restoreAllMocks()
      })

      it('should return a 500 http code', async () => {
        const res = await request(nestApp.getHttpServer()).get('/tareas/999999')
        expect(res.status).toBe(500)
      })
    })
  })

  it('GET /tareas/:id and PUT /tareas/:id should return and update a task', async () => {
    const listRes = await request(nestApp.getHttpServer()).get('/tareas')
    expect(listRes.status).toBe(200)
    const data = listRes.body.data
    expect(data.length).toBeGreaterThan(0)

    const id = data[0].id
    const getRes = await request(nestApp.getHttpServer()).get(`/tareas/${id}`)
    expect(getRes.status).toBe(200)
    expect(getRes.body.id).toBe(id)

    const updatedDto = {
      ...getRes.body,
      descripcion: 'Descripcion actualizada desde test',
    }
    const putRes = await request(nestApp.getHttpServer())
      .put(`/tareas/${id}`)
      .send(updatedDto)
    expect(putRes.status).toBe(200)
    expect(putRes.body.descripcion).toBe('Descripcion actualizada desde test')
  })

  it('GET /usuarios should return an array of users', async () => {
    const res = await request(nestApp.getHttpServer()).get('/usuarios')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
  })

  describe('POST /tareas', () => {
    it('should create a new task and return 201', async () => {
      const usuariosResponse = await request(nestApp.getHttpServer()).get(
        '/usuarios'
      )
      const primerUsuario = usuariosResponse.body[0]

      const nuevaTarea = {
        descripcion: 'Tarea creada desde test de integracion',
        iteracion: 'Sprint 1',
        asignadoA: primerUsuario.nombre,
        fecha: '15/06/2026',
        porcentajeCumplimiento: 0,
      }

      const createResponse = await request(nestApp.getHttpServer())
        .post('/tareas')
        .send(nuevaTarea)

      expect(createResponse.status).toBe(201)
      expect(createResponse.body).toHaveProperty('id')
      expect(createResponse.body.descripcion).toBe(
        'Tarea creada desde test de integracion'
      )
      expect(createResponse.body.iteracion).toBe('Sprint 1')
      expect(createResponse.body.asignadoA).toBe(primerUsuario.nombre)
    })

    it('should return 404 when the assigned user does not exist', async () => {
      const nuevaTarea = {
        descripcion: 'Tarea con usuario inexistente',
        iteracion: 'Sprint 1',
        asignadoA: 'Usuario Inexistente Xyz123',
        fecha: '15/06/2026',
        porcentajeCumplimiento: 0,
      }

      const createResponse = await request(nestApp.getHttpServer())
        .post('/tareas')
        .send(nuevaTarea)

      expect(createResponse.status).toBe(404)
    })
  })

  describe('DELETE /tareas/:id', () => {
    it('should delete an existing task', async () => {
      const listResponse = await request(nestApp.getHttpServer()).get('/tareas')
      const tareas = listResponse.body.data
      expect(tareas.length).toBeGreaterThan(0)

      const idParaEliminar = tareas[0].id
      const deleteResponse = await request(nestApp.getHttpServer()).delete(
        `/tareas/${idParaEliminar}`
      )

      expect(deleteResponse.status).toBe(200)

      const getResponse = await request(nestApp.getHttpServer()).get(
        `/tareas/${idParaEliminar}`
      )
      expect(getResponse.status).toBe(404)
    })

    it('should return 404 when the task does not exist', async () => {
      const deleteResponse = await request(nestApp.getHttpServer()).delete(
        '/tareas/999999'
      )
      expect(deleteResponse.status).toBe(404)
    })
  })
})
