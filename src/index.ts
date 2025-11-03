import express from 'express'
import asyncHandler from 'express-async-handler'
import { getTareaById, getTareas, updateTarea } from './controller/tareaController.js'
import type { TareaDto } from './domain/tarea.js'
import { errorMiddleware } from './errors/errorMiddleware.js'
import cors from 'cors'
import { getUsuarios } from './controller/usuarioController.js'

const app = express()
const PORT = process.env.PORT || 9000

app.use(express.json())

app.use(cors())

app.get('/tareas', asyncHandler(async (req, res) => {
  const { page, limit } = req.query
  const respuestaPaginada = await getTareas(page as string, limit as string)
  res.json(respuestaPaginada)
}))

app.get('/tareas/:id', asyncHandler(async (req, res) => {
  const { id } = req.params
  const tarea = await getTareaById(id as string)
  res.json(tarea)
}))

app.get('/usuarios', asyncHandler(async (req, res) => {
  const usuarios = await getUsuarios()
  res.json(usuarios)
}))

app.put('/tareas/:id', asyncHandler(async (req, res) => {
  const { id } = req.params
  const tareaDto = req.body as TareaDto
  const tareaActualizada = await updateTarea(id as string, tareaDto)
  res.json(tareaActualizada)
}))

// Sólo iniciar el servidor cuando no estamos en entorno de test
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`✅ Servidor de Tareas (TS - ESM) corriendo en http://localhost:${PORT}`)
  })
}

app.use(errorMiddleware)

export default app
