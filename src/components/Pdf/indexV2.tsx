import { Page, View, Document, PDFViewer } from "@react-pdf/renderer";
import clsx from "clsx";
import pdfStyles from "./style";
import { memo } from "react";

type Props = {
  show: boolean;
  data: { headers: JSX.Element[]; values: JSX.Element[] }[];
  onClose: () => void;
};

const PDFDocumentV2 = (props: Props) => {
  const { show, data, onClose } = props;

  return (
    <div
      className={clsx(
        "fixed top-0 bottom-0 left-0 right-0 transition-all ease-linear duration-75 text-xl z-[9999]",
        [show ? "block" : "hidden"],
      )}
    >
      <div
        className="absolute w-full h-full bg-black/50 z-10"
        onClick={onClose}
      />
      <div className="absolute w-10/12 h-screen top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 z-30">
        <PDFViewer showToolbar={true} className="w-full h-full">
          <Document pageLayout="singlePage" language="vi_VN">
            <Page size="A3" style={pdfStyles.page}>
              {data.map((item, index) => (
                <View
                  key={index}
                  style={[
                    {
                      paddingBottom: 30,
                    },
                  ]}
                >
                  <View
                    style={[
                      pdfStyles.flex,
                      pdfStyles.flexRow,
                      pdfStyles.alignCenter,
                      pdfStyles.justifyBetween,
                      {
                        paddingBottom: 5,
                        marginBottom: 10,
                        borderBottom: "1px solid #303032",
                        gap: "20px",
                      },
                    ]}
                  >
                    {item.headers}
                  </View>
                  {item.values}
                </View>
              ))}
            </Page>
          </Document>
        </PDFViewer>
      </div>
    </div>
  );
};

export default memo(PDFDocumentV2);
