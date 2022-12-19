export enum CurrenciesEnum {
  EUR = "EUR",
  USD = "USD",
  UAH = "UAH",
  CAD = "CAD",
  CNY = "CNY",
}

export type Currencies = { [key in CurrenciesEnum]: string }

export interface ICurrency {
  code: CurrenciesEnum
  value: number
}
