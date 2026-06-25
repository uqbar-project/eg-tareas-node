import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'

const PORT = process.env.PORT || 9000

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors()

  if (process.env.NODE_ENV !== 'test') {
    await app.listen(PORT, () => {
      console.log(
        `✅ Servidor de Tareas (NestJS) corriendo en http://localhost:${PORT}`
      )
    })
  }
}

bootstrap().catch(error => {
  console.error('❌ Error al iniciar la aplicación', error)
  process.exit(1)
})

export { bootstrap }
