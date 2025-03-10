import { Controller, Get, Post, Body, Patch, Param, Req, UseGuards } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}


  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createRequestDto: CreateRequestDto, @Req() req) {
    const sender= req.user.userId;
    return this.requestsService.create(createRequestDto, sender);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.requestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto) {
    return this.requestsService.update(id, updateRequestDto);
  }
}
