/* eslint-disable @typescript-eslint/no-empty-function */
import { CreatePackageDto } from './dto/create-package.dto';
import { ConfigService } from "@nestjs/config";
import { TestingModule, Test } from "@nestjs/testing";
import { PrismaService } from "./../prisma/prisma.service";
import { PackageService } from "./package.service";

describe("PackageService", () => {
   let service: PackageService;
   let prisma: PrismaService;
   let packageColor: string;


   beforeAll(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            PackageService,
            PrismaService,
            PackageService,
            ConfigService,
         ],
      }).compile();
      service = module.get<PackageService>(PackageService);
      prisma = module.get<PrismaService>(PrismaService);
   });

   afterAll(async () => {
      await prisma.cleanDatabase();
   });

   describe("should create", () => {
      const dto: CreatePackageDto = {
         billType: 10,
         billQuantity: 50,
      }

      it("package closed", async () => {
         const pkg = await service.create(dto)
         packageColor = pkg.color

         expect(pkg.status).toBe('closed')
         expect(pkg.color).toEqual(expect.any(String))
      })
      it("package opened with distinct color", async () => {
         dto.billQuantity = 45

         const pkg = await service.create(dto)
         
         expect(pkg.status).toBe('opened')
         expect(pkg.color).not.toBe(packageColor)
      })
      it("many closed packages", async () => {})
      it("many closed packages with last opened", async () => {})
   })
})