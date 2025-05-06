export interface OptionValueProduct {
  id: string;
  name: string;
}

export interface OptionProduct {
  id: string;
  name: string;
  values: OptionValueProduct[];
}
