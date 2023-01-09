import { IsHexColor, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Max } from "class-validator";

export class CreatePackageDto {
   @IsInt()
   @IsIn([10, 50, 100])
   @IsNotEmpty()
   billType: number;

   @IsInt()
   @Max(50)
   @IsNotEmpty()
   billQuantity: number;
   
   @IsInt()
   @IsOptional()
   operationId?: number;

   @IsInt()
   @IsOptional()
   grandpaId?: number;
}

export class CreateNestedPackageDto extends CreatePackageDto {
   @IsString()
   @IsIn(["opened", "closed"])
   @IsNotEmpty()
   status: string;

   @IsHexColor()
   @IsNotEmpty()
   color: string;
}