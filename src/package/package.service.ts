import {
   ClosedPackage,
   OpenedPackage,
   Package
} from "./entities/package.entity"
import { PrismaService } from "./../prisma/prisma.service"
import { Injectable } from "@nestjs/common"
import {
   CreatePackageDto,
   CreateNestedPackageDto
} from "./dto/create-package.dto"
import { CreateManyPackagesDto } from "./dto/create-many-packages.dto"
import { maxBillQuantity } from "../constants"
import { generateRandomHexColor } from "./utils"

@Injectable()
export class PackageService {
   constructor(private readonly prisma: PrismaService) {}

   /**
    * Create many packages at once.
    * Intended to be used to create packages for sub-operations.
    *
    * @param {CreateManyPackagesDto} dto Data Transfer Object
    * @return {*} Quantity of packages created
    * @memberof PackageService
    */
   async createMany(dto: CreateManyPackagesDto): Promise<{ count: number }> {
      const data = []
      const billQuantity = Math.floor(dto.value / dto.billType)
      const closedPackagesQuantity = Math.floor(billQuantity / maxBillQuantity)
      delete dto.value

      for (let i = closedPackagesQuantity; i > 0; i--) {
         data.push(new ClosedPackage({ ...dto }))
      }

      const remainingBills = Math.floor(
         billQuantity - closedPackagesQuantity * maxBillQuantity
      )
      if (remainingBills) {
         data.push(new OpenedPackage({ ...dto, billQuantity: remainingBills }))
      }

      const batchPayload = this.prisma.package.createMany({ data })

      return batchPayload
   }

   async create(dto: CreatePackageDto) {
      const pkg = this.prisma.package.create({
         data: new Package({ ...dto })
      })

      return pkg
   }

   async findAll(operationId: number, grandpa?: true) {
      const where = grandpa ? { grandpaId: operationId } : { operationId }

      return this.prisma.package.findMany({ where })
   }

   findOne(packageId: number, operationId: number) {
      return this.prisma.package.findFirst({
         where: { id: packageId, operationId }
      })
   }

   remove(packageId: number) {
      return this.prisma.package.delete({
         where: { id: packageId }
      })
   }

   nestedCreateMany(args: { value: number; billType: number }) {
      const packages: CreateNestedPackageDto[] = []
      const remainingBills = Math.round(args.value % args.billType)
      let closedPackages = Math.round(args.value / args.billType)

      while (closedPackages) {
         const closedPackage = {
            billQuantity: maxBillQuantity,
            status: "closed",
            color: generateRandomHexColor(),
            billType: args.billType
         }

         packages.push(closedPackage)
         closedPackages--
      }

      if (remainingBills) {
         const openedPackage = {
            billQuantity: remainingBills,
            status: "opened",
            color: generateRandomHexColor(),
            billType: args.billType
         }

         packages.push(openedPackage)
      }

      return packages
   }
}
