import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PrismaService extends PrismaClient {
	constructor(config: ConfigService) {
		super({
			datasources: {
				db: {
					url: config.get("DATABASE_URL")
				}
			}
		})
	}
   cleanDatabase() {
      return this.$transaction([
         this.package.deleteMany(),
         this.operation.deleteMany(),
         this.user.deleteMany(),
      ]);
   }
}
