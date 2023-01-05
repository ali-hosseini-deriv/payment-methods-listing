import { ReactNode, useMemo } from "react";
import PaymentMethodStore from "./PaymentMethod.store";
import StoreContext, { IStoreContext } from "./store.context";

interface IStoreProvider {
  children: ReactNode;
  store: PaymentMethodStore;
}

const StoreProvider = ({ children, store }: IStoreProvider) => {
  const contextValue: IStoreContext = useMemo(() => {
    return { store };
  }, []);

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
