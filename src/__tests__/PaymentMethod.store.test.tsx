import { IResidenceItem } from "../Components/types";
import PaymentMethodStore, {
  selectedCountryInitValue,
} from "../store/PaymentMethod.store";
import { fake_payment_methods } from "./fakes/payment_methods";
import { fake_residence_list } from "./fakes/residence_list";

describe("Store", () => {
  let store: PaymentMethodStore;
  beforeEach(() => {
    store = new PaymentMethodStore();
  });
  afterEach(() => {
    store.clear();
  });

  it("Should have loading as false", () => {
    expect(store.loading).toBeFalsy();
  });

  it("Should update country list", () => {
    store.updateCountryList(fake_residence_list.residence_list);
    expect(store.countryListStore).toHaveLength(
      fake_residence_list.residence_list.length
    );
    expect(store.countryListStore).toEqual(fake_residence_list.residence_list);
  });

  it("Should update the selected country", () => {
    expect(true).toBeFalsy();
  });

  it("Should have initial select country value on resetSelectedCountry", () => {
    expect(true).toBeFalsy();
  });

  it("Should update payment methods", () => {
    expect(true).toBeFalsy();
  });

  it("Should clear payment methods on resetPaymentMethods", () => {
    expect(true).toBeFalsy();
  });

  it("Should have loading as fulsy by default", () => {
    expect(true).toBeFalsy();
  });
  it("Should have loading as truthy on toggleLoading", () => {
    expect(true).toBeFalsy();
  });
});
