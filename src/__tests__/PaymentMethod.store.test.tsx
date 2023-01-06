import PaymentMethodStore, {
  selectedCountryInitValue,
} from "../store/PaymentMethod.store";
import { fake_payment_methods } from "./fakes/payment_methods";
import { fake_residence_list } from "./fakes/residence_list";

describe("Store", () => {
  let store: PaymentMethodStore;

  beforeEach(() => (store = new PaymentMethodStore()));
  afterEach(() => store.clear());

  it("Should have loading as false", () => {
    expect(store.loading).toEqual(false);
  });

  it("Should update country list", () => {
    store.updateCountryList(fake_residence_list.residence_list);
    expect(store.countryListStore).toHaveLength(
      fake_residence_list.residence_list.length
    );
    expect(store.countryListStore).toEqual(fake_residence_list.residence_list);
  });

  it("Should update the selected country", () => {
    const selected_item = fake_residence_list.residence_list[1];
    store.updateSelectedCountry(selected_item);
    expect(store.selectedCountry).toEqual(selected_item);
  });

  it("Should have initial select country value on resetSelectedCountry", () => {
    store.resetSelectedCountry();
    expect(store.selectedCountry).toEqual(selectedCountryInitValue);
  });

  it("Should update payment methods", () => {
    const data = fake_payment_methods.payment_methods;
    store.updatePaymentMethods(data);
    expect(store.paymentMethods).toHaveLength(data.length);
    expect(store.paymentMethods).toEqual(data);
  });

  it("Should clear payment methods on resetPaymentMethods", () => {
    store.resetPaymentMethods();
    expect(store.paymentMethods.length).toEqual(0);
  });

  it("Should have loading as fulsy by default", () => {
    expect(store.loading).toBeFalsy();
  });

  it("Should have loading as truthy on toggleLoading", () => {
    store.toggleLoading();
    expect(store.loading).toBeTruthy();
  });
});
