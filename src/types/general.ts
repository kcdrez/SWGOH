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
}

interface iTableHead {
  headers: iHeader[];
  sortMethod?: string;
  sortDir?: "asc" | "desc";
  classes?: string;
  methodChange?: Function;
  directionChange?: Function;
}

export { iHeader, iTableHead };
