// src/modules/product/app/dto/product-output.dto.ts

export interface ProductOutputDTO {
  ProductID: number;
  Name: string;
  Description: string;
  Price: number;
  CategoryID: number;
  ImgUrl: string | null;
  CategoryName?: string;
}
