import moment from "moment";
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
