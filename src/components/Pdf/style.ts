import { StyleSheet, Font } from "@react-pdf/renderer";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
      fontWeight: 300,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: 400,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
      fontWeight: 500,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: 600,
    },
  ],
});

// Create styles
const pdfStyles = StyleSheet.create({
  page: {
    padding: 10,
    fontFamily: "Roboto",
  },
  textXs: {
    fontSize: 12,
  },
  textSm: {
    fontSize: 14,
  },
  textBase: {
    fontSize: 16,
  },
  textLg: {
    fontSize: 18,
  },
  textXl: {
    fontSize: 20,
  },
  textCenter: {
    textAlign: "center",
  },
  textUppercase: {
    textTransform: "uppercase",
  },
  textCapitalize: {
    textTransform: "capitalize",
  },
  textLowercase: {
    textTransform: "lowercase",
  },
  fontMedium: {
    fontWeight: 500,
  },
  fontSemiBold: {
    fontWeight: 600,
  },
  fontBold: {
    fontWeight: 700,
  },
  flex: {
    display: "flex",
  },
  flexColumn: {
    flexDirection: "column",
  },
  flexRow: {
    flexDirection: "row",
  },
  alignCenter: {
    alignItems: "center",
  },
  justifyCenter: {
    justifyContent: "center",
  },
  justifyBetween: {
    justifyContent: "space-between",
  },
});

export default pdfStyles;
