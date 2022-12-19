import axios from "axios"
import React, { useEffect, useState } from "react"
import { CurrenciesEnum, ICurrency } from "../../types"
import flags from "../../assets/icons"
import "./Converter.scss"

const API = import.meta.env.VITE_API_KEY

enum Current {
  first = "first",
  second = "second",
}

type InitData = {
  first: ICurrency
  second: ICurrency
  current: Current
}

const initData: InitData = {
  first: { code: CurrenciesEnum.EUR, value: 0 },
  second: { code: CurrenciesEnum.UAH, value: 0 },
  current: Current.first,
}

const Converter = () => {
  const [data, setData] = useState(initData)
  const [update, setUpdate] = useState(0)

  useEffect(() => {
    update && convertCurrencies()
  }, [update])

  const convertCurrencies = () => {
    const { current } = data

    axios
      .get(
        `https://api.currencyapi.com/v3/latest?apikey=${API}&currencies=${data.first.code}%2C${data.second.code}&base_currency=${data[current].code}`
      )
      .then((response) => {
        if (response.status === 200) {
          const rowData: ICurrency[] = Object.values(response.data.data)

          const countData = rowData.map((currency) => ({
            code: currency.code,
            value: +(currency.value * data[current].value).toFixed(2),
          }))

          const dataSorteds = [data.first.code, data.second.code]

          countData.sort(
            (a, b) => dataSorteds.indexOf(a.code) - dataSorteds.indexOf(b.code)
          )

          const temp = {
            first: countData[0],
            second: countData[1],
            current,
          }
          setData(temp)
        }
      })
  }

  const handleCurrencyAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name
    const value = +parseFloat(e.target.value).toFixed(2)
    const key = name.split("_")[0] as Current
    setData((data) => ({
      ...data,
      current: key,
      [key]: { ...data[key], value },
    }))
  }

  const handleSelectCurrency = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.name
    const code = e.target.value
    const key = name.split("_")[0] as Current
    setData((data) => ({
      ...data,
      current: key,
      [key]: { ...data[key], code },
    }))
    setUpdate((i) => ++i)
  }

  return (
    <div className="converter">
      <div className="container">
        <div className="columns">
          <div className="column">
            <div className="row">
              <img src={flags[data.first.code]} alt="" />
              <input
                type="number"
                name="first_field"
                value={data.first.value || ""}
                onChange={handleCurrencyAmount}
                onBlur={convertCurrencies}
                min={1}
                step={0.01}
                placeholder="Enter amount"
              />
              <select
                name="first_currency"
                value={data.first.code}
                onChange={handleSelectCurrency}
              >
                {Object.keys(CurrenciesEnum).map((currency) => (
                  <option
                    key={currency}
                    value={currency}
                    disabled={
                      currency == data.first.code ||
                      currency == data.second.code
                    }
                  >
                    {currency}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="column">
            <div className="row">
              <img src={flags[data.second.code]} alt="" />
              <input
                type="number"
                name="second_field"
                value={data.second.value || ""}
                onChange={handleCurrencyAmount}
                onBlur={convertCurrencies}
                min={1}
                step={0.01}
                placeholder="Enter amount"
              />
              <select
                name="second_currency"
                value={data.second.code}
                onChange={handleSelectCurrency}
              >
                {Object.keys(CurrenciesEnum).map((currency) => (
                  <option
                    key={currency}
                    value={currency}
                    disabled={
                      currency == data.first.code ||
                      currency == data.second.code
                    }
                  >
                    {currency}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Converter
