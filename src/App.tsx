import React from "react";
import CountryList from "./Components/CountryList";
import useWebsocket from "./hooks/useWebsocket";
import PaymentMethodStore from "./store/PaymentMethod.store";
import StoreProvider from "./store/store.provider";

const App = ({ store }: { store: PaymentMethodStore }) => {
  const websocket = useWebsocket();
  return (
    <StoreProvider store={store}>
      <CountryList websocket={websocket} />
    </StoreProvider>
  );
};

export default App;
