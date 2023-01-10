import { maxBillQuantity } from "../../constants"
import { generateRandomHexColor } from "../utils"

export class Package {
   id?: number
   grandpaId?: number
   operationId?: number
   billType: number
   billQuantity: number
   status: string
   color: string

   constructor(props: { billType: number; billQuantity: number }) {
      Object.assign(this, props)
      this.status = this.billQuantity < maxBillQuantity ? "opened" : "closed"
      this.color = generateRandomHexColor()
   }
}

export class ClosedPackage implements Package {
   billQuantity = 50
   status = "closed"
   billType: number
   grandpaId: number
   color: string

   constructor(props: { billType: number; grandpaId: number }) {
      Object.assign(this, props)
      this.color = generateRandomHexColor()
   }
}

export class OpenedPackage implements Package {
   status = "opened"
   billQuantity: number
   billType: number
   grandpaId: number
   color: string

   constructor(props: {
      billType: number
      billQuantity: number
      grandpaId: number
   }) {
      Object.assign(this, props)
      this.color = generateRandomHexColor()
   }
}
