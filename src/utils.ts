import moment from "moment";
import store from "./vuex-store/store";

export function unvue(data: any) {
  return JSON.parse(JSON.stringify(data));
}

export function setupEvents(el: HTMLElement, name: string) {
  if (el) {
    if (
      name in store.state.collapseSections &&
      !store.state.collapseSections[name]
    ) {
      el.classList.value += " show";
    }
    el.addEventListener("hidden.bs.collapse", () => {
      store.dispatch("toggleCollapse", { name, hidden: true });
    });
    el.addEventListener("shown.bs.collapse", () => {
      store.dispatch("toggleCollapse", { name, hidden: false });
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
