import type { UIOverrides } from "@povio/ui";

import { buttonIconSizeOverride, buttonOverride } from "./defaults/button.override";
import { checkboxIconOverride, checkboxOverride, checkboxTypography } from "./defaults/checkbox.override";
import { inputBaseOverride, inputSideOverride, inputSizeOverride } from "./defaults/input.override";
import { labelBaseOverride, labelTypography } from "./defaults/label.override";
import { modalContentOverride, modalMainOverride, modalOverlayOverride } from "./defaults/modal.override";
import { radioOverride, radioTypography } from "./defaults/radio.override";
import {
  tableCellTextOverride,
  tableDataOverride,
  tableHeadDataOverride,
  tableHeaderTextOverride,
  tableRowOverride,
} from "./defaults/table.override";
import { tagOverride } from "./defaults/tag.override";
import { typographyOverride } from "./defaults/typography.override";

export const uiOverrides: UIOverrides.Config = {
  button: {
    cva: buttonOverride,
    iconSize: buttonIconSizeOverride,
  },
  checkbox: {
    cva: checkboxOverride,
    iconCva: checkboxIconOverride,
    typography: checkboxTypography,
  },
  input: {
    baseCva: inputBaseOverride,
    sizeCva: inputSizeOverride,
    sideCva: inputSideOverride,
  },
  label: {
    cva: labelBaseOverride,
    typography: labelTypography,
  },
  modal: {
    contentCva: modalContentOverride,
    mainCva: modalMainOverride,
    overlayCva: modalOverlayOverride,
  },
  radio: {
    cva: radioOverride,
    typography: radioTypography,
  },
  table: {
    cellTextCva: tableCellTextOverride,
    dataCva: tableDataOverride,
    headDataCva: tableHeadDataOverride,
    headerTextCva: tableHeaderTextOverride,
    rowCva: tableRowOverride,
  },
  tag: {
    cva: tagOverride,
  },
  typography: {
    cva: typographyOverride,
  },
};
