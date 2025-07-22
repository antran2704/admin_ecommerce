import { Link } from "react-router-dom";
import { IOrderItemResponse } from "../interfaces";
import PATH_NAME from "~/routes/paths";
import { formatBigNumber } from "~/helper/format";

interface IProps {
  item: IOrderItemResponse;
}

export const OrderItem = ({ item }: IProps) => {
  const productName = item.variantProduct
    ? item.variantProduct.name
    : item.product.name;

  const price = item.promotionPrice ? item.promotionPrice : item.basePrice;

  return (
    <div className="flex sm:flex-row flex-col items-center space-x-4">
      <Link
        to={PATH_NAME.UPDATE_PRODUCT(item.product.productId)}
        target="_blank"
      >
        <img
          src={item.thumbnail}
          alt={productName}
          className="w-20 h-20 rounded-lg object-cover border border-gray-200"
        />
      </Link>
      <div className="flex-1">
        <Link
          to={PATH_NAME.UPDATE_PRODUCT(item.product.productId)}
          target="_blank"
        >
          <p className="font-medium text-gray-900">{productName}</p>
        </Link>
        <p className="text-sm text-gray-500 sm:text-left text-center">
          {formatBigNumber(price)} x {item.quantity}
        </p>
        {item.variantProduct && (
          <p className="text-sm text-gray-500 sm:text-left text-center">
            {item.variantProduct.options
              .map((option) => option.name)
              .join(" / ")}
          </p>
        )}
      </div>
    </div>
  );
};
