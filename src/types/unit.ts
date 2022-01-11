import { PlayerUnit } from "./player";
export interface Unit {
  id: string;
  thumbnailName: string;
  nameKey: string;
  unitTierList: UnitTier[];
  tier: number;
  //there's a ton more data here
}

interface UnitTier {
  tier: number;
  equipmentSetList: string[];
}

export type CombinedUnit = Unit & PlayerUnit; //todo: maybe do this logic on the api
