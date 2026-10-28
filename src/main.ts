import 'reflect-metadata'
import { existsSync } from 'node:fs'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'
import { paginadoActivo } from './tarea/paginado.js'
import { TareaRepository } from './tarea/tarea.repository.js'
import { UsuarioRepository } from './usuario/usuario.repository.js'

if (existsSync('.env')) process.loadEnvFile()

const PORT = process.env.PORT || 9000

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors()

  if (process.env.NODE_ENV !== 'test') {
    await app.listen(PORT)
    console.log(
      `✅ Servidor de Tareas (NestJS) corriendo en http://localhost:${PORT}`
    )
    console.log(
      `${paginadoActivo() ? '🟢' : '⚪'} Paginado ${paginadoActivo() ? 'activo' : 'inactivo'}`
    )

    const tareasRepository = app.get(TareaRepository)
    const usuariosRepository = app.get(UsuarioRepository)
    const [tareas, usuarios] = await Promise.all([
      tareasRepository.getTareas(),
      usuariosRepository.getUsuarios(),
    ])
    console.log(`📋 Tareas iniciales: ${tareas.length}`)
    console.log(`👥 Usuarios iniciales: ${usuarios.length}`)
  }
}

bootstrap().catch(error => {
  console.error('❌ Error al iniciar la aplicación', error)
  process.exit(1)
})

export { bootstrap }
