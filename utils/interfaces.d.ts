export interface ECBExchangeRate {
  currency: string;
  rate: number;
}

export interface ExchangeRates {
  [rate: string]: number;
}
