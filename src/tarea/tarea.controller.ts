import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common'
import type { TareaDto } from '../domain/tarea.js'
import { TareasService } from './tarea.service.js'

@Controller('tareas')
export class TareaController {
  constructor(private readonly tareasService: TareasService) {}

  @Get()
  async getTareas(
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const pageNum = page ? Number(page) : 1
    const limitNum = limit ? Number(limit) : 0
    return this.tareasService.getTareas(pageNum, limitNum)
  }

  @Get(':id')
  async getTareaById(@Param('id') id: string) {
    return this.tareasService.getTareaById(+id)
  }

  @Put(':id')
  async updateTarea(@Param('id') id: string, @Body() dto: TareaDto) {
    return this.tareasService.updateTarea(+id, dto)
  }
}
