import { createContext, ReactNode } from "react";
import PaymentMethodStore from "./PaymentMethod.store";

export interface IStoreContext {
  store: PaymentMethodStore;
}

const initial = {
  store: {} as PaymentMethodStore,
};

const StoreContext = createContext<IStoreContext>(initial);

export default StoreContext;
