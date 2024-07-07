import {
  Controller,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginatinoDto } from 'src/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // @Post() // esta parte se comenta porque ahora es un microservicio y no un RestfullAPI, tambien se reemplaza el @Body , @Query, @Param por @Payload
  @MessagePattern({cmd: 'create_product'})
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // @Get()
  @MessagePattern({cmd: 'find_all'})
  findAll(@Payload() paginatinoDto: PaginatinoDto) {
    return this.productsService.findAll(paginatinoDto);
  }
  
  // @Get(':id')
  @MessagePattern({cmd: 'find_one_product'})
  findOne(@Payload('id',ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  // @Patch(':id')
  @MessagePattern({cmd: 'update_product'})
  update(
    @Payload() updateProductDto:UpdateProductDto
    // @Parma('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.update(updateProductDto.id, updateProductDto);
  }

  // @Delete(':id')
  @MessagePattern({cmd: 'delete_product'})
  remove(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
