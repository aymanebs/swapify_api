import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from './requests.schema';
import { RequestGateway } from './requests.gateway';

@Injectable()
export class RequestsService {
  constructor(
    @InjectModel(Request.name) private readonly requestModel: Model<Request>,
    private readonly requestGateway: RequestGateway,
) {}

  async create(createRequestDto: CreateRequestDto, sender: string) {
    const request = new this.requestModel({...createRequestDto, sender});

    console.log("Emitting event to gateway...");
    this.requestGateway.handleTradeRequest({
      senderId: request.sender,
      receiverId: request.receiver,
    });
    console.log("after emeting event in service");
    return await request.save();
  }

  async findAll() {
    const requests=  await this.requestModel.find().exec();
    if(!requests || requests.length == 0){
      throw new NotFoundException('Requests not found');
    }
    return requests;
  }

  async findOne(id: string) {
    const request = await this.requestModel.findById(id).exec();
    if(!request){
      throw new NotFoundException('request not found');
    }
    return request;
  }

  async findByReceiverId(id: string){

    const requests = await this.requestModel.find({receiver: id}).populate([{
      path: 'sender',
      select: 'first_name last_name avatar'
    },
    {
      path: 'receiver',
      select: 'first_name last_name avatar'
    },
    {
      path: 'itemRequested',
      select: 'name condition photos'
    },
    {
      path: 'itemOffered',
      select: 'name condition photos'
    }
  ]).exec();

    if(!requests || requests.length == 0){
      throw new NotFoundException('Received requests not found');
    }

    return requests;
    
  }

  async findBySenderId(id: string){

    const requests = await this.requestModel.find({sender: id}).populate([{
      path: 'sender',
      select: 'first_name last_name avatar'
    },
    {
      path: 'receiver',
      select: 'first_name last_name avatar'
    },
    {
      path: 'itemRequested',
      select: 'name condition photos'
    },
    {
      path: 'itemOffered',
      select: 'name condition photos'
    }
  ]).exec();

    if(!requests || requests.length == 0){
      throw new NotFoundException('Sender requests not found');
    }

    return requests;
    
  }

  async update(id: string, updateRequestDto: UpdateRequestDto) {
    return await this.requestModel.findByIdAndUpdate(id, updateRequestDto, { new: true }).exec();
  }
}
