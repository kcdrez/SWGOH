export interface Relic {
  id: string;
  location: { node: string; energy: number };
  dropRate: number;
  amount: any;
  image: string;
  name: string;
}