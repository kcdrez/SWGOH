export interface Relic {
  id: string;
  location: { node: string; energy: number };
  dropRate: number;
  amount: any;
  image: string;
  name: string;
  neededBy?: { name: string; id: string }[];
}

export type RelicConfigType = {
  [key: string]: Relic;
};
