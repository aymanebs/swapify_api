import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  beforeEach(async () => {
    const mockCategoriesService = {
      createCategory: jest.fn().mockResolvedValue({ id: 'testId', name: 'Test Category' }),
      getAllCategories: jest.fn().mockResolvedValue([{ id: 'testId', name: 'Test Category' }]),
      updateCategory: jest.fn().mockResolvedValue({ id: 'testId', name: 'Updated Category' }),
      delete: jest.fn().mockResolvedValue({ id: 'testId', name: 'Test Category' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a category', async () => {
    const createCategoryDto = { name: 'Test Category' };
    expect(await controller.create(createCategoryDto)).toEqual({ id: 'testId', name: 'Test Category' });
    expect(service.createCategory).toHaveBeenCalledWith(createCategoryDto);
  });

  it('should get all categories', async () => {
    expect(await controller.getAll()).toEqual([{ id: 'testId', name: 'Test Category' }]);
    expect(service.getAllCategories).toHaveBeenCalled();
  });

  it('should update a category', async () => {
    const updateCategoryDto = { name: 'Updated Category' };
    expect(await controller.update('testId', updateCategoryDto)).toEqual({ id: 'testId', name: 'Updated Category' });
    expect(service.updateCategory).toHaveBeenCalledWith('testId', updateCategoryDto);
  });

  it('should delete a category', async () => {
    expect(await controller.delete('testId')).toEqual({ id: 'testId', name: 'Test Category' });
    expect(service.delete).toHaveBeenCalledWith('testId');
  });
});