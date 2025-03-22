import { memo } from "react";
import { Style } from "@react-pdf/types";
import { Text } from "@react-pdf/renderer";
import pdfStyles from "./style";

interface Props {
  style?: Style;
  value: string;
}

const PDFText = (props: Props) => {
  const { value, style } = props;

  return <Text style={[pdfStyles.textXs, { ...style }]}>{value}</Text>;
};

export default memo(PDFText);
