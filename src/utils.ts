import moment from "moment";
import { read, utils } from "xlsx";
import { loadingState } from "./types/loading";
import store, { ModuleTypes } from "./vuex-store/store";

export function unvue(data: any) {
  return JSON.parse(JSON.stringify(data));
}

export function setupEvents(
  el: HTMLElement,
  name: string,
  defaultExpand = false,
  callbackOnShow?: Function,
  callbackOnHide?: Function
) {
  if (el) {
    if (
      (name in store.state.collapseSections &&
        !store.state.collapseSections[name]) ||
      defaultExpand
    ) {
      el.classList.value += " show";

      if (callbackOnShow) {
        callbackOnShow();
      }
    }
    el.addEventListener("hidden.bs.collapse", () => {
      store.dispatch("toggleCollapse", { name, hidden: true });
      if (callbackOnHide) {
        callbackOnHide();
      }
    });
    el.addEventListener("shown.bs.collapse", () => {
      store.dispatch("toggleCollapse", { name, hidden: false });
      if (callbackOnShow) {
        callbackOnShow();
      }
    });
  } else {
    console.warn(
      "cannot set up collapse events; HTML element doesn't exists",
      name
    );
  }
}

export function formatDate(date: any, format: string = "MMM DD, YYYY") {
  return moment(date).format(format);
}

export function round2Decimals(num: number) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export async function initializeModules(
  modulesList: string[],
  synchronously: boolean = false
) {
  if (synchronously) {
    for (let i = 0; i < modulesList.length; i++) {
      const moduleName = modulesList[i];
      //this doesnt fucking work for player module
      await store.dispatch(`${moduleName}/initialize`);
    }
  } else {
    await Promise.all(
      modulesList.map((moduleName) =>
        store.dispatch(`${moduleName}/initialize`)
      )
    );
  }
}

export function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function pluralText(days: number, single: string, plural: string = "") {
  let text = days.toString();
  if (days === 1) {
    text += ` ${single}`;
  } else {
    text += plural === "" ? ` ${single}s` : ` ${plural}`;
  }
  return text;
}

export function daysFromNow(
  days: number,
  format: string = "MMM D, YYYY"
): string {
  return moment().add(days, "days").format(format);
}

export async function importFile(files: any[]) {
  // const {files, filters} = data;
  if (!files) return;
  return await processXlsxFiles(files);
}

async function processXlsxFiles(files: any[], filterTypes = null) {
  let arr: any[] = [];
  for (let i = 0; i < files.length; i++) {
    arr = arr.concat(await readFile(files[i]));
  }
  return arr;
  // if (filterTypes) {
  //   filterTypes = filterTypes.map(x => x.toLowerCase());
  //   return arr.filter(x => filterTypes.includes(x.type.toLowerCase()));
  // }
  // else return arr;
}

function readFile(file: any) {
  let arr: any[] = [];
  return new Promise((resolve, reject) => {
    let reader = new FileReader();

    reader.onload = () => {
      const bytes = new Uint8Array(reader.result as any);
      let binary = "";
      for (let j = 0; j < bytes.byteLength; j++) {
        binary += String.fromCharCode(bytes[j]);
      }
      const wb = read(binary, { type: "binary" });
      wb.SheetNames.forEach((sheetName) => {
        const jsonSheet = utils.sheet_to_json(wb.Sheets[sheetName]);
        arr = arr.concat(jsonSheet);
      });
      resolve(arr);
    };

    reader.onerror = reject;

    reader.readAsArrayBuffer(file);
  });
}
