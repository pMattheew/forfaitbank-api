import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';

@Injectable()
export class OperationService {
  constructor(private readonly prisma: PrismaService) {}
  
  create(dto: CreateOperationDto) {
    return 'This action adds a new operation';
  }

  findAll() {
    return `This action returns all operation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} operation`;
  }

  update(id: number, dto: UpdateOperationDto) {
    return `This action updates a #${id} operation`;
  }

  remove(id: number) {
    return `This action removes a #${id} operation`;
  }
}
