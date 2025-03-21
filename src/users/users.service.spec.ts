import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserService } from './users.service';
import { User } from './users.schema';
import { CreateUserDto } from './dtos/create-user.dto';

describe('UserService', () => {
  let service: UserService;

  const mockUser = {
    _id: '1',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    avatar: 'avatar.jpg',
    password: 'hashedPassword',
  };

  const mockUserModel = {
    findOne: jest.fn().mockImplementation((query) => {
      if (query.email === 'existing@example.com') {
        return {
          exec: jest.fn().mockResolvedValue(mockUser),
        };
      }
      return {
        exec: jest.fn().mockResolvedValue(null),
      };
    }),
    create: jest.fn().mockImplementation((user) => Promise.resolve(user)),
    find: jest.fn().mockReturnValue({
      lean: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockUser]),
      }),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'existing@example.com';
      const result = await service.findByEmail(email);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      const email = 'nonexistent@example.com';
      const result = await service.findByEmail(email);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email });
      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
 
    it('should throw UnauthorizedException if email is already registered', async () => {
      const createUserDto: CreateUserDto = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'existing@example.com',
        avatar: 'avatar.jpg',
        password: 'password123',
      };

      await expect(service.createUser(createUserDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('checkEmailUnique', () => {
    it('should not throw an error if email is unique', async () => {
      const email = 'nonexistent@example.com';
      await expect(service.checkEmailUnique(email)).resolves.not.toThrow();
    });

    it('should throw UnauthorizedException if email is already registered', async () => {
      const email = 'existing@example.com';
      await expect(service.checkEmailUnique(email)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('findAll', () => {
    it('should return all users without passwords', async () => {
      const result = await service.findAll();
      expect(mockUserModel.find).toHaveBeenCalledWith({ email: { $not: /@admin\.com$/i } });
      expect(result).toEqual([{
        _id: '1',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        avatar: 'avatar.jpg',
      }]);
    });
  });
});