import { UploadFile } from "antd";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { v4 as uuidv4 } from "uuid";

import { IFile } from "~/interface";

async function handleGetDataFromExcel<T>(
  file: File,
  keys: (keyof T)[],
  requireKeys: Partial<keyof T>[],
  callback: (data: T[], isValidData?: boolean) => void,
) {
  // Create new workbook
  const workbook = new ExcelJS.Workbook();

  const result: T[] = [];
  let isValid: boolean = true;

  // Create data from file
  const data = await file.arrayBuffer(); // Read data file with type buffer
  await workbook.xlsx.load(data); // Load data into workbook

  const worksheet = workbook.getWorksheet(1); // Get first worksheet

  for (const row of worksheet.getRows(2, worksheet.rowCount)) {
    if (!row.values.length) continue;

    const payload: any = {};
    const formatValue = (row.values as string[]).slice(1).map((value: any) => {
      if (typeof value === "object" && value.hyperlink) {
        return value.text;
      }

      if (value === null) {
        return "";
      }

      return value;
    });

    for (let i = 0; i < keys.length; i++) {
      payload[keys[i]] = formatValue[i] || "";

      if (requireKeys.includes(keys[i]) && !formatValue[i] && isValid) {
        isValid = false;
      }
    }
    result.push({ ...payload });
  }

  callback(result, isValid);
}

async function createExcelFile<T>(
  items: T[],
  fileName: string,
  sheetName: string,
  headers: Partial<ExcelJS.Column>[],
  options?: {
    requireHeaders?: string[]; // title of headers
    dropDown?: { key: string; values: string[] }[];
  },
  extraHandler?: (worksheet: ExcelJS.Worksheet) => void,
) {
  /* create a new blank workbook */
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName); // Add new worksheet

  worksheet.columns = headers; // Set headers for worksheet

  for (const item of items) {
    worksheet.addRow(Object.values(item));
  }

  if (extraHandler) {
    extraHandler(worksheet);
  }

  // Set style for require headers
  worksheet.getRow(1).eachCell((cell) => {
    if (options?.requireHeaders?.includes(cell.value as string)) {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFF00" },
      };
      cell.font = { bold: true, color: { argb: "FF0000" } };
    } else {
      cell.font = { bold: true };
    }

    cell.alignment = { horizontal: "center" };
  });

  // Create dropdown list
  options?.dropDown?.forEach((dropDown) => {
    worksheet.getColumn(dropDown.key).eachCell((cell, rowNumber) => {
      if (rowNumber > 1) {
        cell.dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: dropDown.values,
        };
      }
    });
  });

  // Export and save file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/octet-stream" });
  saveAs(blob, fileName + ".xlsx");
}

async function createExcelFileWithMultipleTypeData(
  data: {
    items: any[];
    headers: Partial<ExcelJS.Column>[];
    options?: {
      requireHeaders?: string[]; // title of headers
      dropDown?: { key: string; values: string[] }[];
    };
    extraHandler?: (worksheet: ExcelJS.Worksheet) => void;
  }[],
  fileName: string,
  sheetName: string,
) {
  /* create a new blank workbook */
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName); // Add new worksheet

  for (const { headers, items, options, extraHandler } of data) {
    worksheet.addRow(headers.map((item) => item.header)); // Set headers for worksheet

    for (const item of items) {
      worksheet.addRow(Object.values(item));
    }

    if (extraHandler) {
      extraHandler(worksheet);
    }

    // Create dropdown list
    options?.dropDown?.forEach((dropDown) => {
      worksheet.getColumn(dropDown.key).eachCell((cell, rowNumber) => {
        if (rowNumber > 1) {
          cell.dataValidation = {
            type: "list",
            allowBlank: true,
            formulae: dropDown.values,
          };
        }
      });
    });

    worksheet.addRow([]); // Add empty row
  }

  // Export and save file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/octet-stream" });
  saveAs(blob, fileName + ".xlsx");
}

// Get file url from payload of API
const resolveFileUrl = (file: IFile): string | null => {
  return file ? file.url : null;
};

// Convert file data to Image File type
const convertToImageFile = (fileData: IFile): Partial<File> => {
  if (fileData) {
    return {
      name: fileData.fileName,
      lastModified: isNaN(Number(fileData.fileName))
        ? 0
        : Number(fileData.fileName),
      size: 0,
      type: "old", //set old for check file new or old when update
      webkitRelativePath: "",
    };
  }

  return null;
};

// Convert file data to Document File type
const convertToDocumentFile = (
  fileData: IFile,
  options?: Partial<UploadFile>,
): Partial<UploadFile> => {
  const defaultNameFile = "Document";

  if (fileData) {
    return {
      size: 0,
      type: "old", //set old for check file new or old when update
      uid: uuidv4(),
      name: defaultNameFile,
      lastModified: isNaN(Number(fileData.fileName))
        ? 0
        : Number(fileData.fileName),
      url: fileData.url,
      ...options,
    };
  }

  return null;
};

// Mark image file type to old after update
const updateImageFileTypeToOld = (
  file: Partial<File>,
): Partial<File> | null => {
  if (file) {
    return new File([file as File], file.name, {
      type: "old",
    });
  }

  return null;
};

// Mark document file type to old after update
const updateDocumentFileTypeToOld = (
  file: Partial<UploadFile>,
): Partial<UploadFile> | null => {
  if (file) {
    return { ...file, type: "old" };
  }

  return null;
};

// Get last modified of file to upload file
const getLastModifiedOfFile = (file: Partial<File>): string | null => {
  return file ? file.lastModified.toString() : null;
};

export {
  handleGetDataFromExcel,
  createExcelFile,
  createExcelFileWithMultipleTypeData,
  resolveFileUrl,
  convertToImageFile,
  convertToDocumentFile,
  getLastModifiedOfFile,
  updateImageFileTypeToOld,
  updateDocumentFileTypeToOld,
};
