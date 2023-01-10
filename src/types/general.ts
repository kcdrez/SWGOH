interface iHeader {
  label: any;
  show?: boolean;
  classes?: string;
  containerClass?: string;
  maxWidth?: string;
  // isInput?: boolean;
  input?: {
    type: "button" | "input" | "multiselect" | "checkbox";
    classes?: string;
    placeholder?: string;
    click?: Function;
    label?: string;
    options?: any[];
    storageKey?: string;
    value?: any;
  };
  // inputClass?: string;
  // inputPlaceHolder?: string;
  click?: Function;
  icon?: string;
  // isClickable?: boolean;
  title?: string;
  // showButton?: boolean;
  // buttonClass?: string;
  // buttonText?: string;
  // buttonClick?: Function;
  // multiSelect?: boolean;
  // type?: "button" | "input" | "multiselect";
}

export { iHeader };
