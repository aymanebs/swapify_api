import { Injectable } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from './requests.schema';

@Injectable()
export class RequestsService {
  constructor(@InjectModel(Request.name) private readonly requestModel: Model<Request>) {}

  async create(createRequestDto: CreateRequestDto, sender: string) {
    const request = new this.requestModel({...createRequestDto, sender});
    return await request.save();
  }

  async findAll() {
    return await this.requestModel.find().exec();
  }

  async findOne(id: string) {
    return await this.requestModel.findById(id).exec();
  }

  async update(id: string, updateRequestDto: UpdateRequestDto) {
    return await this.requestModel.findByIdAndUpdate(id, updateRequestDto, { new: true }).exec();
  }
}
