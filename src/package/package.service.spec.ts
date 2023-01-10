import { CreateManyPackagesDto } from "./dto/create-many-packages.dto"
import { CreatePackageDto } from "./dto/create-package.dto"
import { ConfigService } from "@nestjs/config"
import { TestingModule, Test } from "@nestjs/testing"
import { PrismaService } from "./../prisma/prisma.service"
import { PackageService } from "./package.service"
/* eslint-disable @typescript-eslint/no-empty-function */

describe("PackageService", () => {
   let service: PackageService
   let prisma: PrismaService
   let grandpaOperationId: number
   let operationId: number

   beforeAll(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            PackageService,
            PrismaService,
            PackageService,
            ConfigService
         ]
      }).compile()
      service = module.get<PackageService>(PackageService)
      prisma = module.get<PrismaService>(PrismaService)
   })

   afterAll(async () => {
      await prisma.cleanDatabase()
   })

   describe("create", () => {
      const dto: CreatePackageDto = {
         billType: 10,
         billQuantity: 50
      }
      let packageColor: string

      it("should create closed package", async () => {
         const pkg = await service.create(dto)
         packageColor = pkg.color

         expect(pkg.status).toBe("closed")
         expect(pkg.color).toEqual(expect.any(String))
      })

      it("should create opened package with distinct color", async () => {
         dto.billQuantity = 45

         const pkg = await service.create(dto)

         expect(pkg.status).toBe("opened")
         expect(pkg.color).not.toBe(packageColor)
         operationId = pkg.operationId
      })
   })

   describe("createMany", () => {
      const manyDto: CreateManyPackagesDto = {
         billType: 100,
         value: 100,
         grandpaId: 1
      }

      it("should create only one closed package", async () => {
         manyDto.value = 5000
         const batchPayload = await service.createMany(manyDto)
         expect(batchPayload).toEqual({ count: 1 })
      })

      it("should create only one opened package", async () => {
         manyDto.value = 1099
         const batchPayload = await service.createMany(manyDto)
         expect(batchPayload).toEqual({ count: 1 })
      })

      it("should create many closed packages", async () => {
         manyDto.value = 15000
         const batchPayload = await service.createMany(manyDto)
         expect(batchPayload).toEqual({ count: 3 })
      })

      it("should create many closed packages with last opened", async () => {
         manyDto.grandpaId, (grandpaOperationId = 2)
         manyDto.value = 14999
         const batchPayload = await service.createMany(manyDto)

         expect(batchPayload).toEqual({ count: 3 })
      })
   })

   describe("findAll", () => {
      it("should find all children from operation", async () => {
         // const children = await service.findAll(operationId, true)
         // expect(children).toHaveLength(2)
      })

      it("should find all children from grandpa operation", async () => {
         // const children = await service.findAll(grandpaOperationId)
         // expect(children).toHaveLength(3)
         // expect(children[2]).toMatchObject({ status: 'opened'})
      })
   })
})
