import axios from "axios"
import { useEffect } from "react"
import flags from "../../assets/icons"
import { useLocalStorage } from "../../hooks"
import { ICurrency } from "../../types"
import "./Navigation.scss"

const API = import.meta.env.VITE_API_KEY
const APP_NAME = import.meta.env.VITE_APP_NAME

const Navigation = () => {
  const [state, setState] = useLocalStorage<ICurrency[]>(APP_NAME, [])

  useEffect(() => {
    axios
      .get(
        `https://api.currencyapi.com/v3/latest?apikey=${API}&currencies=EUR%2CUSD&base_currency=UAH`
      )
      .then((response) => {
        if (response.status === 200) {
          const data: ICurrency[] = Object.values(response.data.data)
          const uah_rates: ICurrency[] = data.map((currency) => ({
            code: currency.code,
            value: 1 / currency.value,
          }))
          setState(uah_rates)
        }
      })
  }, [])

  return (
    <nav>
      <div className="container">
        {!!state.length && (
          <div className="currencies">
            {state.map((currency) => (
              <div className="currency" key={currency.code}>
                <img src={flags[currency.code]} alt={currency.code} />
                <span>{currency.value.toFixed(2)} ₴</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
