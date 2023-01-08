import { useContext } from "react";
import PaymentMethodStore from "../store/PaymentMethod.store";
import StoreContext from "../store/store.context";

const useStore = (): PaymentMethodStore => {
  return useContext(StoreContext).store;
};

export default useStore;
