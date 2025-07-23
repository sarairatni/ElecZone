// src/modules/product/app/dto/create-product.dto.ts
export interface ProductInputDTO {
  Name: string;
  Description: string;
  Price: number;
  CategoryID: number;
  ImgUrl?: string;
}