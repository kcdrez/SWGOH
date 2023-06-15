interface iHeaderCell {
  label?: any;
  show?: boolean;
  sortMethodShow?: boolean;
  classes?: string;
  containerClass?: string;
  maxWidth?: string;
  input?: {
    type:
      | "button"
      | "input"
      | "multiselect"
      | "checkbox"
      | "list"
      | "image"
      | "gear"
      | "relic";
    classes?: string;
    placeholder?: string;
    click?: Function;
    label?: string;
    options?: any[];
    storageKey?: string;
    value?: any;
    change?: Function;
    src?: string;
  };
  click?: Function;
  icon?: string;
  title?: string;
  value?: any;
  colspan?: string;
  rowspan?: string;
  data?: any;
  showOption?: boolean;
  buttons?: {
    classes: string;
    click: Function;
    title?: string;
  }[];
}

interface iHeaderRow {
  classes?: string;
  cells: iHeaderCell[];
  show?: boolean;
}

interface iTableHead {
  headers: iHeaderRow[];
  classes?: string;
  sortMethod?: string;
  sortDir?: "asc" | "desc";
  methodChange?: Function;
  directionChange?: Function;
  collapseTarget?: string;
  title?: string;
  multiOptions?: { label: string; value: string }[];
  storageKey?: string;
  select?: Function;
}

interface iTableBody {
  rows: iTableRow[];
  classes?: string;
  zeroState?: {
    message: string;
    show: boolean;
    classes?: string;
  };
  id?: string;
}

interface iTableRow {
  cells: iTableCell[];
  classes?: string;
  hide?: boolean;
}

interface iTableCell {
  type?:
    | "unit"
    | "progress"
    | "unitLevel"
    | "buttons"
    | "link"
    | "gear"
    | "gearList"
    | "relic"
    | "relicOwned"
    | "text"
    | "buttonToggle"
    | "gearOwned"
    | "list"
    | "time"
    | "checkbox"
    | "checkmark"
    | "number"
    | "shardsOwned"
    | "nodes"
    | "priority"
    | "currencyList"
    | "dailyCurrency"
    | "remainingCurrency"
    | "unitRequirement"
    | "targetLevel"
    | "html"
    | "mod"
    | "unitSearch"
    | "date"
    | "select"
    | "relicFarm"
    | "loading";
  edit?: boolean;
  data: any;
  labelClasses?: string;
  simpleView?: boolean;
  show: boolean;
  classes?: string;
  label?: string;
  value?: string;
  zeroState?: {
    message: string;
    show: boolean;
    classes?: string;
  };
  change?: Function;
  click?: Function;
  enter?: Function;
  colspan?: string;
  rowspan?: string;
}

interface iTable {
  header?: iTableHead;
  body?: iTableBody;
  footer?: iTableBody;
  show?: boolean;
  classes?: string;
}

interface iExpandOptions {
  input?: {
    onEnter?: Function;
    change: Function;
    value: string;
  };
  buttons?: {
    classes: string;
    click: Function;
    title?: string;
  }[];
  toggle?: {
    onLabel: string;
    offLabel: string;
    value: boolean;
    change: Function;
  };
  multiSelect?: {
    options: { label: string; value: string; showOption?: boolean }[];
    change: Function;
    value?: string[];
  };
  onShow?: Function;
  onHide?: Function;
  zIndex?: number;
  header?: {
    classes?: string;
  };
}

export {
  iHeaderCell,
  iHeaderRow,
  iTableHead,
  iTableBody,
  iTableRow,
  iTableCell,
  iTable,
  iExpandOptions,
};
