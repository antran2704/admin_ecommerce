import { ThemeConfig } from "antd";
import { ComponentToken as SegmentedComponentToken } from "antd/es/segmented/style";
import { ComponentToken as SelectComponentToken } from "antd/es/select/style";
import { ComponentToken as TableComponentToken } from "antd/es/table/style";
import { ComponentToken as TabsComponentToken } from "antd/es/tabs/style";
import { ComponentToken as AnchorComponentToken } from "antd/es/anchor/style";
import { ComponentToken as CollapseComponentToken } from "antd/es/collapse/style";
import { ComponentToken as ButtonComponentToken } from "antd/es/button/style";
import { ComponentToken as MenuComponentToken } from "antd/es/menu/style";
import { ComponentToken as InputComponentToken } from "antd/es/input/style";
import { ComponentToken as DatePickerComponentToken } from "antd/es/date-picker/style";
import { AliasToken } from "antd/es/theme/internal";

const tokenAntd: Partial<AliasToken> = {
  fontFamily: "Be Vietnam Pro",
};

// Config tabs component
const styleTabs: Partial<TabsComponentToken> = {
  itemColor: "dark:text-white",
  horizontalMargin: "0 0 0 0",
  itemSelectedColor: "#007A54",
  inkBarColor: "#007A54",
  itemHoverColor: "#007A54",
};

// Config segment component
const styleSegment: Partial<SegmentedComponentToken> = {
  itemSelectedBg: "#007A54",
  itemSelectedColor: "white",
};

// Config select component
const styleSelect: Partial<SelectComponentToken> = {
  optionFontSize: 16,
  optionPadding: "6px 12px",
  optionSelectedBg: "#2D9055",
  optionSelectedColor: "white",
};

// Config table component
const styleTable: Partial<TableComponentToken> = {
  headerBorderRadius: 0,
  headerSplitColor: "transparent",
  rowHoverBg: "#EFFFF5",
  rowSelectedBg: "#EFFFF5",
  rowSelectedHoverBg: "#EFFFF5",
};

// Config anchor component
const styleAnchor: Partial<AnchorComponentToken> = {
  linkPaddingInlineStart: 20,
};

// Config collapse component
const styleCollapse: Partial<CollapseComponentToken> = {
  contentBg: "transparent",
};

// Config button component
const styleButton: Partial<ButtonComponentToken> = {
  defaultColor: "#007A54",
  defaultBorderColor: "#007A54",
  defaultHoverBorderColor: "#02662A",
  defaultHoverColor: "#02662A",
};

// Config menu component
const styleMenu: Partial<MenuComponentToken> = {
  itemSelectedColor: "#007A54",
  itemSelectedBg: "#F6F6F6",
};

// Config input component
const styleInput: Partial<InputComponentToken> = {
  hoverBorderColor: "#007A54",
  activeBorderColor: "#007A54",
};

// Config date picker component
const styleDatePicker: Partial<DatePickerComponentToken> = {
  hoverBorderColor: "#007A54",
  activeBorderColor: "#007A54",
};

const configGlobalAntd: ThemeConfig = {
  token: tokenAntd,
  components: {
    Segmented: styleSegment,
    Select: styleSelect,
    Table: styleTable,
    Tabs: styleTabs,
    Anchor: styleAnchor,
    Collapse: styleCollapse,
    Button: styleButton,
    Menu: styleMenu,
    Input: styleInput,
    DatePicker: styleDatePicker,
  },
};

export default configGlobalAntd;
