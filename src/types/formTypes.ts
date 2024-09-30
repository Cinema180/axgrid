export interface EnergySourceConfig {
  fields: FormField[];
}

export type FieldType = 'text' | 'number' | 'select'; // Extend this with other required field types like 'select', 'checkbox', etc.

export interface FormField {
  label: string;
  name: string;
  options?: string[];
  required?: boolean;
  type: FieldType;
}

export interface FormConfig {
  [energySource: string]: EnergySourceConfig | FormField[];
  commonFields: FormField[];
}

export interface FormData {
  [key: string]: string | number;
}
