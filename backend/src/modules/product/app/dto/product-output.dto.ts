// src/modules/product/app/dto/product-output.dto.ts

export interface ProductOutputDTO {
  ProductID: number;
  Name: string;
  Price: number;
  CategoryID: number;
  ImgUrl: string | null;
}
