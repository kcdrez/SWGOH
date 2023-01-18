interface iHeader {
  label: any;
  show?: boolean;
  sortMethodShow?: boolean;
  classes?: string;
  containerClass?: string;
  maxWidth?: string;
  input?: {
    type: "button" | "input" | "multiselect" | "checkbox" | "list" | "image";
    classes?: string;
    placeholder?: string;
    click?: Function;
    label?: string;
    options?: any[];
    storageKey?: string;
    value?: any;
    change?: Function;
  };
  click?: Function;
  icon?: string;
  title?: string;
  value?: any;
  colspan?: string;
}

interface iTableHead {
  headers: iHeader[];
  sortMethod?: string;
  sortDir?: "asc" | "desc";
  classes?: string;
  methodChange?: Function;
  directionChange?: Function;
}

interface iTableBody {
  rows: iTableRow[];
  classes?: string;
  zeroState?: {
    message: string;
    show: boolean;
    classes?: string;
  };
  // key: string;
}

interface iTableRow {
  cells: iTableCell[];
  classes?: string;
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
    | "html"
    | "mod"
    | "unitSearch"
    | "date"
    | "select";
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

export { iHeader, iTableHead, iTableBody, iTableRow, iTableCell };
