import axios from "axios";
import { Editor, FileLoader } from "ckeditor5";
import { TFunction } from "i18next";

class UploadAdapter {
  private loader: any;
  private callbackUpload?: (file: File) => Promise<any>;

  constructor(loader: any, callbackUpload?: (file: File) => Promise<any>) {
    this.loader = loader;
    this.callbackUpload = callbackUpload;
  }

  upload() {
    return this.loader.file.then((file: File) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          if (this.callbackUpload) {
            const newUrl: string = await this.callbackUpload(file);

            if (!newUrl) return;

            await axios.put(newUrl, file, {
              headers: {
                "Content-Type": file.type,
              },
            });
            resolve({ default: newUrl.split("?")[0] });
          } else {
            resolve({ default: reader.result });
          }
        };
        reader.onerror = (error) => {
          reject(error);
        };
      });
    });
  }
}

function CustomUploadAdapterPlugin(data?: {
  callbackUpload?: (file: File) => Promise<any>;
}) {
  return function (editor: Editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (
      loader: FileLoader,
    ) => {
      return new UploadAdapter(loader, data.callbackUpload);
    };
  };
}

export default CustomUploadAdapterPlugin;
