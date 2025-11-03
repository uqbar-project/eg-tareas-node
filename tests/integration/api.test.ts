import request from 'supertest'
import app from '../../src/index'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { tareaRepository } from '../../src/repository/tareaRepository'

describe('API integration tests', () => {
  it('GET /tareas should return page and data array', async () => {
    const res = await request(app).get('/tareas')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('page')
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.page).toBe(1)
  })

  it('GET /tareas should return second page and data array', async () => {
    const res = await request(app).get('/tareas?page=2&limit=5')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('page')
    const tasks = res.body.data
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(tasks.length).toBe(5)
    expect(res.body.page).toBe(2)
  })

  describe('GET /tareas/:id error handling', () => {
    it('should return a 404 http code for a non-existing task', async () => {
      const res = await request(app).get('/tareas/999999')
      expect(res.status).toBe(404)
    })

    describe('when database fails', () => {
      beforeEach(() => {
        vi.spyOn(tareaRepository, 'getTareaById').mockImplementation(() => {
          throw new Error('Database connection failed')
        })
      })

      afterEach(() => {
        vi.restoreAllMocks()
      })

      it('should return a 500 http code', async () => {
        const res = await request(app).get('/tareas/999999')
        expect(res.status).toBe(500)
        expect(res.body.message).toBe('Error interno del servidor')
      })
    })
  })

  it('GET /tareas/:id and PUT /tareas/:id should return and update a task', async () => {
    const listRes = await request(app).get('/tareas')
    expect(listRes.status).toBe(200)
    const data = listRes.body.data
    expect(data.length).toBeGreaterThan(0)

    const id = data[0].id
    const getRes = await request(app).get(`/tareas/${id}`)
    expect(getRes.status).toBe(200)
    expect(getRes.body.id).toBe(id)

    const updatedDto = { ...getRes.body, descripcion: 'Descripcion actualizada desde test' }
    const putRes = await request(app).put(`/tareas/${id}`).send(updatedDto)
    expect(putRes.status).toBe(200)
    expect(putRes.body.descripcion).toBe('Descripcion actualizada desde test')
  })

  it('GET /usuarios should return an array of users', async () => {
    const res = await request(app).get('/usuarios')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
  })
})
