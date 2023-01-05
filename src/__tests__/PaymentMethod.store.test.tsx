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
//there is a simular test on line 49, what is the catch?
  it("Should have loading as false", () => {
    expect(store.loading).toBeTruthy();
  });

  it("Should update country list", () => {
    store.updateCountryList(fake_residence_list.residence_list);
    expect(store.countryListStore).toHaveLength(
      fake_residence_list.residence_list.length
    );
    expect(store.countryListStore).toEqual(fake_residence_list.residence_list);
  });

  it("Should update the selected country", () => {
    store.updateSelectedCountry(fake_residence_list.residence_list[0]);
    expect(store.selectedCountry).toEqual(fake_residence_list.residence_list[0]);
  });

  it("Should have initial select country value on resetSelectedCountry", () => {
    store.resetSelectedCountry();
    expect(store.selectedCountry).toEqual(selectedCountryInitValue);
  });

  it("Should update payment methods", () => {
    store.updatePaymentMethods(fake_payment_methods.payment_methods);
    expect(store.paymentMethods).toEqual(fake_payment_methods.payment_methods);
  });

  it("Should clear payment methods on resetPaymentMethods", () => {
    store.resetPaymentMethods();
    expect(store.paymentMethods).toHaveLength(0);
  });

  it("Should have loading as falsy by default", () => {
    expect(store.loading).toBeFalsy();
  });

  it("Should have loading as truthy on toggleLoading", () => {
    //actually, I check default in prev. test, so probably there is no need in line 55
    expect(store.loading).toBeFalsy();
    store.toggleLoading();
    expect(store.loading).toBeTruthy();
  });
});
