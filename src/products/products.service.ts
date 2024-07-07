import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginatinoDto } from '../common/dto/pagination.dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    this.logger.log(`Database ready to work! :)`);
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginatinoDto: PaginatinoDto) {
    const { page, limit } = paginatinoDto;

    const totalData = await this.product.count({where:{available: true}});
    const lastPage = Math.ceil(totalData / limit);

    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {available:true}
      }),
      meta: {
        total: totalData,
        page: page,
        lastPage: lastPage,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: { id, available:true },
    });
    if (!product) {
      throw new NotFoundException(`Product with id #${id} not found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id); // uso este metodo previo para validar que existe el producto con el id

    return this.product.update({
      where: { id },
      data: updateProductDto
    })
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.product.update({
      where:{id},
      data:{
        available: false
      }
    })

    // return this.product.delete({
    //   where: {id}
    // })
  }
}
