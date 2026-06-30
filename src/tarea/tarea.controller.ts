import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import type { TareaDto } from '../domain/tarea.js'
import { TareasService } from './tarea.service.js'

@Controller('tareas')
export class TareaController {
  constructor(private readonly tareasService: TareasService) {}

  private validatePositiveInteger(
    paramValue: string | undefined,
    paramName: string,
    allowZero = false
  ): number {
    if (!paramValue) return allowZero ? 0 : 1
    const num = Number(paramValue)
    if (
      Number.isNaN(num) ||
      !Number.isInteger(num) ||
      num < 0 ||
      (num === 0 && !allowZero)
    ) {
      throw new BadRequestException(
        `Parámetro '${paramName}' inválido: debe ser un entero positivo${allowZero ? ' o cero' : ''}`
      )
    }
    return num
  }

  @Get()
  async getTareas(
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const pageNum = this.validatePositiveInteger(page, 'page')
    const limitNum = this.validatePositiveInteger(limit, 'limit', true)
    return this.tareasService.getTareas(pageNum, limitNum)
  }

  @Get(':id')
  async getTareaById(@Param('id') id: string) {
    const idNum = this.validatePositiveInteger(id, 'id')
    return this.tareasService.getTareaById(idNum)
  }

  @Put(':id')
  async updateTarea(@Param('id') id: string, @Body() dto: TareaDto) {
    const idNum = this.validatePositiveInteger(id, 'id')
    return this.tareasService.updateTarea(idNum, dto)
  }

  @Post()
  async createTarea(@Body() dto: TareaDto) {
    return this.tareasService.createTarea(dto)
  }

  @Delete(':id')
  async deleteTarea(@Param('id') id: string) {
    const idNum = this.validatePositiveInteger(id, 'id')
    await this.tareasService.deleteTarea(idNum)
  }
}
