import { IResidenceItem } from "../Components/types";
import PaymentMethodStore, {
  selectedCountryInitValue,
} from "../store/PaymentMethod.store";
import { fake_payment_methods } from "./fakes/payment_methods";
import { fake_residence_list } from "./fakes/residence_list";

describe("Store", () => {
  let store: PaymentMethodStore;
  const payment_methods = fake_payment_methods.payment_methods
  const residence_list = fake_residence_list.residence_list
  const first_residence: IResidenceItem = fake_residence_list.residence_list[0]

  beforeEach(() => {
    store = new PaymentMethodStore()
  })
  afterEach(() => {
    store.clear()
  })

  it("Should have loading as false", () => {
    expect(store.loading).toBeFalsy()
  })

  it("Should update country list", () => {
    store.updateCountryList(residence_list)

    expect(store.countryListStore).toEqual(residence_list)
  })

  it("Should update the selected country", () => {
    store.updateSelectedCountry(residence_list[0])

    expect(store.selectedCountry).toEqual(first_residence)
  })

  it("Should have initial select country value on resetSelectedCountry", () => {
    store.updateSelectedCountry(first_residence)
    store.resetSelectedCountry()

    expect(store.selectedCountry).toEqual(selectedCountryInitValue)
  })

  it("Should update payment methods", () => {
    store.updatePaymentMethods(payment_methods)

    expect(store.paymentMethods).toEqual(payment_methods)
  })

  it("Should clear payment methods on resetPaymentMethods", () => {
    store.updatePaymentMethods(payment_methods)
    store.resetPaymentMethods()

    expect(store.paymentMethods).toEqual([])
  })

  it("Should have loading as falsy by default", () => {
    expect(store.loading).toBeFalsy()
  })

  it("Should have loading as truthy on toggleLoading", () => {
    store.toggleLoading()

    expect(store.loading).toBeTruthy()
  })
})