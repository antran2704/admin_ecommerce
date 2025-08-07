import { ENUM_TRANSACTION_STATUS } from "~/enum/transaction";
import { ENUM_ORDER_STATUS } from "../enums";

export interface IOrderTable {
  id: string;
  totalPrice: number;
  status: ENUM_ORDER_STATUS;
  transactionStatus: ENUM_TRANSACTION_STATUS;
  customerName: string;
  phoneNumber: string;
  createdAt: string;
}
