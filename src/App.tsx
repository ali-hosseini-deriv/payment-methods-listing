import React from "react"
import CountryList from "./Components/CountryList"

const App = () => {
  const websocket = React.useRef<WebSocket>()
  React.useEffect(() => {
    if (
      !websocket?.current &&
      ![0, 1].includes(websocket?.current?.readyState || 3)
    ) {
      websocket.current = new WebSocket(
        "wss://ws.binaryws.com/websockets/v3?app_id=1089"
      )
    }
  }, [])
  return <CountryList websocket={websocket} />
}

export default App
