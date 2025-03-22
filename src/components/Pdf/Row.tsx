import { View } from "@react-pdf/renderer";
import { Style } from "@react-pdf/types";
import pdfStyles from "./style";

interface Props {
  style?: Style;
  children?: React.ReactNode;
}

const PDFRow = (props: Props) => {
  const { children, style } = props;

  return (
    <View
      style={[
        pdfStyles.flex,
        pdfStyles.flexRow,
        pdfStyles.alignCenter,
        pdfStyles.justifyBetween,
        { gap: "20px", ...style },
      ]}
    >
      {children}
    </View>
  );
};

export default PDFRow;
