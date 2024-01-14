import moment from "moment";
import { read, utils } from "xlsx";
import { ref, computed, watch, Ref } from "vue";
import _ from "lodash";

import store from "./vuex-store/store";

export function unvue(data: any) {
  return _.cloneDeep(data);
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

    el.addEventListener("hidden.bs.collapse", (event) => {
      const targetId = (event.target as any).getAttribute("id");
      if (targetId === el.id) {
        store.dispatch("toggleCollapse", { name, hidden: true });
        if (callbackOnHide) {
          callbackOnHide();
        }
      }
    });
    el.addEventListener("shown.bs.collapse", (event) => {
      const targetId = (event.target as any).getAttribute("id");
      if (targetId === el.id) {
        store.dispatch("toggleCollapse", { name, hidden: false });
        if (callbackOnShow) {
          callbackOnShow();
        }
      }
    });
  } else {
    console.warn(
      "cannot set up collapse events; HTML element doesn't exist",
      name
    );
  }
}

export function formatDate(date: any, format: string = "MMM DD, YYYY") {
  return moment(date).format(format);
}

export function round2Decimals(num: number) {
  return _.round(num, 2);
}

export function round(num, decimals) {
  return _.round(num, decimals);
}

export async function initializeModules(
  modulesList: string[],
  synchronously: boolean = false,
  params: any = {}
) {
  if (synchronously) {
    for (let i = 0; i < modulesList.length; i++) {
      const moduleName = modulesList[i];
      //this doesnt fucking work for player module
      await store.dispatch(`${moduleName}/initialize`, params);
    }
  } else {
    await Promise.all(
      modulesList.map((moduleName) =>
        store.dispatch(`${moduleName}/initialize`, params)
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
  if (!files) return;
  return await processXlsxFiles(files);
}

async function processXlsxFiles(files: any[], filterTypes = null) {
  let arr: any[] = [];
  for (let i = 0; i < files.length; i++) {
    arr = arr.concat(await readFile(files[i]));
  }
  return arr;
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

function saveStorageData(storageKey: string, data: Object) {
  const existingData = JSON.parse(
    window.localStorage.getItem(storageKey) || "{}"
  );
  const saveData = {
    ...existingData,
    ...data,
  };

  window.localStorage.setItem(storageKey, JSON.stringify(saveData));
}

export function setupSorting(storageKey: string) {
  type tSortDir = "asc" | "desc";

  const storageData = JSON.parse(
    window.localStorage.getItem(storageKey) || "{}"
  );
  const sortDir: Ref<tSortDir> = ref(storageData.sortDir ?? "asc");
  const sortMethod: Ref<string> = ref(storageData.sortMethod ?? "name");
  const searchTextTemp = ref("");
  const searchText = computed({
    get(): string {
      return searchTextTemp.value;
    },
    set: _.debounce(function (newVal: string) {
      searchTextTemp.value = newVal;
    }, 500),
  });

  function sortBy(val: string) {
    if (sortMethod.value === val) {
      sortDir.value = sortDir.value === "asc" ? "desc" : "asc";
    } else {
      sortDir.value = "asc";
    }
    sortMethod.value = val;
    saveStorageData(storageKey, {
      sortDir: sortDir.value,
      sortMethod: sortMethod.value,
    });
  }

  function sortIcon(type: string): string {
    if (sortMethod.value === type) {
      return sortDir.value === "asc" ? "fa-sort-down" : "fa-sort-up";
    } else {
      return "fa-sort";
    }
  }

  return { sortDir, sortMethod, searchText, sortBy, sortIcon };
}

export function setupColumnEvents(columns: Ref<string[]>) {
  function showCol(key: string) {
    return columns.value.some((x) => x === key);
  }

  return { showCol };
}

export function setupSimpleView(storageKey: string) {
  const storageData = JSON.parse(
    window.localStorage.getItem(storageKey) || "{}"
  );

  const simpleView: Ref<boolean> = ref(storageData.simpleView ?? true);

  watch(simpleView, (newVal) => {
    saveStorageData(storageKey, {
      simpleView: newVal,
    });
  });

  return { simpleView };
}

export function sortValues(
  valueA: any,
  valueB: any,
  sortDir: "asc" | "desc",
  sortMethod?: string
) {
  try {
    if (sortMethod === "date") {
      if (sortDir === "asc") {
        return moment(valueA.date).isBefore(valueB.date) ? 1 : -1;
      } else {
        return moment(valueB.date).isBefore(valueB.date) ? 1 : -1;
      }
    } else if (
      typeof valueA === "object" &&
      typeof valueB === "object" &&
      !!sortMethod &&
      sortMethod in valueA &&
      sortMethod in valueB
    ) {
      return getSortOrder(valueA[sortMethod], valueB[sortMethod], sortDir);
    } else {
      return getSortOrder(valueA, valueB, sortDir);
    }
  } catch (err) {
    console.warn(err, valueA, valueB, sortMethod, sortDir);
    return 0;
  }
}

export function getSortOrder(
  valueA: any,
  valueB: any,
  sortDir: "asc" | "desc"
) {
  if (valueA instanceof Array && valueB instanceof Array) {
    return getSortOrder(valueA.length, valueB.length, sortDir);
  } else if (typeof valueA === "string" && typeof valueB === "string") {
    const compareA = valueA.toLowerCase().replace(/\s/g, "");
    const compareB = valueB.toLowerCase().replace(/\s/g, "");
    if (compareA === compareB) {
      return 0;
    } else if (sortDir === "asc") {
      return compareA > compareB ? 1 : -1;
    } else {
      return compareA > compareB ? -1 : 1;
    }
  } else if (typeof valueA === "number" && typeof valueB === "number") {
    if (valueA === valueB) {
      return 0;
    } else if (sortDir === "asc") {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueB > valueA ? 1 : -1;
    }
  } else if (typeof valueA === "boolean" && typeof valueB === "boolean") {
    if (valueA === valueB) {
      return 0;
    } else if (sortDir === "asc") {
      return valueA ? 1 : -1;
    } else {
      return valueB ? 1 : -1;
    }
  } else {
    // throw new Error("Sorting type mismatch");
    return 0;
  }
}

export function numbersOnly(e: any) {
  const keyCode = e.keyCode ? e.keyCode : e.which;
  if (keyCode < 48 || keyCode > 57) {
    e.preventDefault();
  }
}

/**
 * Checks the likelihood of something happening
 *
 * @param percentChance - The chances of something happening (can be either decimal or whole number)
 * @returns Whether the event has occurred
 */
export function chanceOfEvent(percentChance: number): boolean {
  if (percentChance < 1) {
    percentChance *= 100;
  }
  return percentChance >= randomNumber(1, 100);
}
