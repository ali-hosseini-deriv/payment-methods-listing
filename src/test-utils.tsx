import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import StoreProvider from "./store/store.provider";
import PaymentMethodStore from "./store/PaymentMethod.store";

export const TestStore = new PaymentMethodStore();

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <StoreProvider store={TestStore}>{children}</StoreProvider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
