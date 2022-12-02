import { AuthDto } from "./../src/auth/dto/auth.dto";
import { CreateUserDto } from "./../src/user/dto/create-user.dto";
import { Test } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { AppModule } from "./../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";
import * as pactum from "pactum";

describe("AppController (e2e)", () => {
   let app: INestApplication;
   let prisma: PrismaService;

   beforeAll(async () => {
      const moduleRef = await Test.createTestingModule({
         imports: [AppModule],
      }).compile();

      app = moduleRef.createNestApplication();
      app.useGlobalPipes(
         new ValidationPipe({
            whitelist: true,
         })
      );

      await app.init();
      await app.listen(3300);

      prisma = app.get(PrismaService);
      await prisma.cleanDatabase();
      pactum.request.setBaseUrl("http://localhost:3300");
   });

   afterAll(async () => {
      await prisma.$disconnect();
      app.close();
   });

   describe("Auth", () => {
      const dto: CreateUserDto = {
         name: "Patrick",
         email: "pms@gmail.com",
         password: "1234",
         cpf: "432.234.432-43",
         birthdate: new Date(2003, 11, 22),
         address: "Rua 5B",
      };

      const authDto: AuthDto = {
         email: dto.email,
         password: dto.password,
      };

      it("should throw if no body provided", () => {
         return pactum.spec().post("/auth/signup").expectStatus(400);
      });

      it("should sign up", () => {
         return pactum
            .spec()
            .post("/auth/signup")
            .withBody(dto)
            .expectStatus(201);
      });

      it("should sign in", () => {
         return pactum
            .spec()
            .post("/auth/signin")
            .withBody(authDto)
            .expectStatus(200)
            .stores("userAt", "access_token");
      });
   });
});
