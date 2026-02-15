export interface Record {
  id: string;
  startDate: string;
  endDate: string;
  waterMeterStart: number;
  waterMeterEnd: number;
  waterUnitPrice: number;
  electricMeterStart: number;
  electricMeterEnd: number;
  electricUnitPrice: number;
  extraFee: number;
}

export interface Unit {
  id: string;
  name: string;
  records: Record[];
}

export interface Settings {
  defaultWaterUnitPrice: number;
  defaultElectricUnitPrice: number;
  defaultExtraFee: number;
}

export interface AppData {
  units: Unit[];
  settings: Settings;
}

export interface ComputedValues {
  waterFeeTotal: number;
  electricFeeTotal: number;
  allFeeTotal: number;
}
