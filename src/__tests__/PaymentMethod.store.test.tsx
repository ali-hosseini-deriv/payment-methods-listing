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
    const storeLoading = store.loading;
    expect(storeLoading).toBeFalsy();
  });

  it("Should update country list", () => {
    store.updateCountryList(fake_residence_list.residence_list);
    const countryListStore = store.countryListStore;
    expect(countryListStore).toHaveLength(
      fake_residence_list.residence_list.length
    );
    expect(countryListStore).toEqual(fake_residence_list.residence_list);
  });

  it("Should update the selected country", () => {
    store.updateSelectedCountry(fake_residence_list.residence_list[0]);
    const selectedCountry = store.selectedCountry;
    expect(selectedCountry).toEqual(
      fake_residence_list.residence_list[0]
    );
  });

  it("Should have initial select country value on resetSelectedCountry", () => {
    const selectedCountry = store.selectedCountry;
    expect(selectedCountry).toEqual(selectedCountryInitValue);
  });

  it("Should update payment methods", () => {
    // First check for Empty
   expect(store.paymentMethods).toHaveLength(0);

    store.updatePaymentMethods(fake_payment_methods.payment_methods);
    expect(store.paymentMethods).toEqual(fake_payment_methods.payment_methods);
    // Now Check for Non-empty
    expect(store.paymentMethods).toHaveLength(1);
  });

  it("Should clear payment methods on resetPaymentMethods", () => {
    store.updatePaymentMethods(fake_payment_methods.payment_methods);
    expect(store.paymentMethods).toEqual(fake_payment_methods.payment_methods);
    store.resetPaymentMethods();
    expect(store.paymentMethods).toHaveLength(0);
  });

  it("Should have loading as falsy by default", () => {
    // test case on line 17 and this one are similar?
    const storeLoading = store.loading;
    expect(storeLoading).toBeFalsy();
  });
  it("Should have loading as truthy on toggleLoading", () => {
    const toggleLoading = store.toggleLoading();
    const storeLoading = store.loading;
    expect(storeLoading).toBeTruthy();
  });
});
