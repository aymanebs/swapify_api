import { Controller, Get, Post, Body, Patch, Param, Req, UseGuards } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('requests')
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new request' })
  @ApiBody({ type: CreateRequestDto })
  @ApiResponse({ status: 201, description: 'Request created successfully.' })
  async create(@Body() createRequestDto: CreateRequestDto, @Req() req) {
    const sender= req.user.userId;
    return this.requestsService.create(createRequestDto, sender);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all requests' })
  @ApiResponse({ status: 200, description: 'Returns a list of requests.' })
  findAll() {
    return this.requestsService.findAll();
  }

  @Get('/received')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get requests received by the logged-in user' })
  @ApiResponse({ status: 200, description: 'Returns a list of received requests.' })
  findByReceiverId(@Req() req){
    return this.requestsService.findByReceiverId(req.user.userId);
  }

  @Get('/sent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get requests sent by the logged-in user' })
  @ApiResponse({ status: 200, description: 'Returns a list of sent requests.' })
  ffindBySenderId(@Req() req){
    return this.requestsService.findBySenderId(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a request by ID' })
  @ApiParam({ name: 'id', description: 'Request ID' })
  @ApiResponse({ status: 200, description: 'Returns the request.' })
  findOne(@Param('id') id: string) {
    return this.requestsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a request' })
  @ApiParam({ name: 'id', description: 'Request ID' })
  @ApiBody({ type: UpdateRequestDto })
  @ApiResponse({ status: 200, description: 'Request updated successfully.' })
  update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto) {
    return this.requestsService.update(id, updateRequestDto);
  }
}
