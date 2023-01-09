import { CreateManyPackagesDto } from "./dto/create-many-packages.dto";
import { PrismaService } from "./../prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { CreatePackageDto, CreateNestedPackageDto } from "./dto/create-package.dto";

@Injectable()
export class PackageService {
   constructor(private readonly prisma: PrismaService) {}
   private readonly MAX_BILL_QUANTITY = 50;

   async createMany(dto: CreateManyPackagesDto) {
      const pkgCount = this.prisma.package.createMany()
   }

   create(dto: CreatePackageDto) {
      const status = dto.billQuantity < this.MAX_BILL_QUANTITY ? 'opened' : 'closed'

      const pkg = this.prisma.package.create({
         data: {
            ...dto,
            status,
            color: this.generateRandomHexColor(),
         },
      });

      return pkg;
   }

   findAll(operationId: number) {
      return this.prisma.package.findMany({
         where: { operationId },
      });
   }

   findOne(packageId: number, operationId: number) {
      return this.prisma.package.findFirst({
         where: { id: packageId, operationId },
      });
   }

   remove(packageId: number) {
      return this.prisma.package.delete({
         where: { id: packageId },
      });
   }

   nestedCreateMany(args: { value: number; billType: number }) {
      const packages: CreateNestedPackageDto[] = [];
      const remainingBills = Math.round(args.value % args.billType);
      let closedPackages = Math.round(args.value / args.billType);

      while (closedPackages) {
         const closedPackage = {
            billQuantity: this.MAX_BILL_QUANTITY,
            status: "closed",
            color: this.generateRandomHexColor(),
            billType: args.billType
         }

         packages.push(closedPackage);
         closedPackages--;
      }

      if (remainingBills) {
         const openedPackage = {
            billQuantity: remainingBills,
            status: "opened",
            color: this.generateRandomHexColor(),
            billType: args.billType
         }

         packages.push(openedPackage)
      }

      return packages;
   }

   generateRandomHexColor(): string {
      const n = (Math.random() * 0xfffff * 1000000).toString(16);
      return "#" + n.slice(0, 6);
   }
}
