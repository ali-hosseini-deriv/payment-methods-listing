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
    store.updateSelectedCountry({
      text: 'test text',
      value: 'test value',
      phone_idd: 'test phone',
    })
    expect(store.selectedCountry.text).toBe('test text');
  });

  it("Should have initial select country value on resetSelectedCountry", () => {
    store.resetSelectedCountry();
    expect(store.selectedCountry.text).toBe('');
  });

  it("Should update payment methods", () => {
    expect(store.paymentMethods.length).toBe(0)
    store.updatePaymentMethods(fake_payment_methods.payment_methods)
    expect(store.paymentMethods.length).toBe(1);
  });

  it("Should clear payment methods on resetPaymentMethods", () => {
    store.updatePaymentMethods(fake_payment_methods.payment_methods)
    expect(store.paymentMethods.length).toBe(1);
    store.resetPaymentMethods();
    expect(store.paymentMethods.length).toBe(0);

  });

  it("Should have loading as truthy on toggleLoading", () => {
    expect(store.loading).toBeFalsy();
    store.toggleLoading();
    expect(store.loading).toBeTruthy();
  });
});
