import {
  ENUM_TRANSACTION_GATEWAY,
  ENUM_TRANSACTION_STATUS,
  ENUM_TRANSACTION_TYPE,
} from "~/enum/transaction";

export interface ITransactionResponse {
  id: string;
  type: ENUM_TRANSACTION_TYPE;
  status: ENUM_TRANSACTION_STATUS;
  externalId: string | null;
  amount: number;
  gateway: ENUM_TRANSACTION_GATEWAY;
  createdAt: string;
}
