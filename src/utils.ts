import store from "./vuex-store/store";

export function unvue(data: any) {
  return JSON.parse(JSON.stringify(data));
}

export function setupEvents(el: HTMLElement, name: string) {
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
}
