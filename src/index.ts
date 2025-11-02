import express from 'express'
import asyncHandler from 'express-async-handler'
import { getTareas, updateTarea } from './controller/tareaController.js'
import type { TareaDto } from './domain/tarea.js'
import { errorMiddleware } from './errors/errorMiddleware.js'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 9000

app.use(express.json())

app.use(cors())

app.get('/tareas', asyncHandler(async (req, res) => {
  const { page, limit } = req.query
  const respuestaPaginada = await getTareas(page as string, limit as string)
  res.json(respuestaPaginada)
}))

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor de Tareas (TS - ESM) corriendo en http://localhost:${PORT}`)
})

app.put('/tareas/:id', asyncHandler(async (req, res) => {
  const { id } = req.params
  const tareaDto = req.body as TareaDto
  const tareaActualizada = await updateTarea(id as string, tareaDto)
  res.json(tareaActualizada)
}))

app.use(errorMiddleware)
