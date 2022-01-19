export type ConfigType = {
  [key: string]: PlannerItem;
};

export interface PlannerItem {
  gear: PlannerData,
  relic: PlannerData
}

interface PlannerData {
  target: number
}

export interface UpdateItem {
  unitId: string;
  type: "gear" | "relic",
  value: number
}