import express, { type NextFunction, type Request, type Response } from 'express'
import { getTareas, updateTarea } from './controller/tareaController.js'
import type { TareaDto } from './domain/tarea.js'
import { errorMiddleware } from './errors/errorMiddleware.js'

const asyncHandler = (fn: (req: Request, res: Response) => unknown) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res)).catch(next)
  }
}

const app = express()
const PORT = process.env.PORT || 9000

app.use(express.json())

app.get('/tareas', asyncHandler((req, res) => {
  const { page, limit } = req.query
  const respuestaPaginada = getTareas(page as string, limit as string)
  res.json(respuestaPaginada)
}))

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor de Tareas (TS - ESM) corriendo en http://localhost:${PORT}`)
})

app.put('/tareas/:id', asyncHandler((req, res) => {
  const { id } = req.params
  const tareaDto = req.body as TareaDto
  const tareaActualizada = updateTarea(id as string, tareaDto)
  res.json(tareaActualizada)
}))

app.use(errorMiddleware)
