import { forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from './requests.schema';
import { RequestGateway } from './requests.gateway';
import { Chat } from 'src/chats/chats.schema';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Item } from 'src/items/items.schema';

@Injectable()
export class RequestsService {
  constructor(
    @InjectModel(Request.name) private readonly requestModel: Model<Request>,
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
    @InjectModel(Item.name) private readonly itemModel: Model<Item>,
    @Inject(forwardRef(() => RequestGateway)) private readonly requestGateway: RequestGateway,
    private readonly eventEmitter: EventEmitter2
) {}

  async create(createRequestDto: CreateRequestDto, sender: string) {

    const itemRequested = await this.itemModel.findById(createRequestDto.itemRequested);

    console.log('itemRequested: ',itemRequested);
    console.log('itemRequested.userId.toString()',itemRequested.userId.toString(),'sender',sender);
    if(itemRequested.userId.toString() == sender){
      console.log("should be unauthorized");
      throw new UnauthorizedException('User cannot request his items');
    }
    const request = new this.requestModel({...createRequestDto, sender});

    this.requestGateway.handleTradeRequest({
      senderId: request.sender,
      receiverId: request.receiver,
    });

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
  ]).sort({createdAt: -1}).exec();


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

    const request = await this.requestModel.findByIdAndUpdate(id, updateRequestDto, { new: true }).exec();

    if(request && request.status === 'accepted'){

      console.log('🔵 Creating chat...');
      const chatData = {participants: [request.sender,request.receiver], request: request._id, messages: []};
      const chat = new this.chatModel(chatData);
      await chat.save();
      console.log('🟢 Chat created:', chat);

      // event emiition
      console.log('🔵 Emitting event: chat.created');
      this.eventEmitter.emit('chat.created', chat);
       const result = this.eventEmitter.emit('chat.created', chat);
       console.log('🟢 Event emitted successfully, result:', result);
    }
    return request;
  }

  async getPendingRequests(userId){

    const requests = await this.requestModel.find({status: 'pending',receiver: userId}).exec();
    return requests;
  }

}
