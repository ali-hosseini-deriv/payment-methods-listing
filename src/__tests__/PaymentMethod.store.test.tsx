// import { screen } from '@testing-library/react';
import { IResidenceItem } from '../Components/types';
import PaymentMethodStore, {
  selectedCountryInitValue,
} from '../store/PaymentMethod.store';
import { fake_payment_methods } from './fakes/payment_methods';
import { fake_residence_list } from './fakes/residence_list';

describe('Store', () => {
  let store: PaymentMethodStore;
  beforeEach(() => {
    store = new PaymentMethodStore();
  });
  afterEach(() => {
    store.clear();
  });

  it('Should have loading as false', () => {
    expect(store.loading).toBeFalsy();
  });

  it('Should update country list', () => {
    store.updateCountryList(fake_residence_list.residence_list);
    expect(store.countryListStore).toHaveLength(
      fake_residence_list.residence_list.length
    );
    expect(store.countryListStore).toEqual(fake_residence_list.residence_list);
  });

  it('Should update the selected country', () => {
    store.updateCountryList(fake_residence_list.residence_list);
    const selectedCountry = fake_residence_list.residence_list[1];
    store.updateSelectedCountry(selectedCountry);
    expect(store.selectedCountry).toEqual(selectedCountry);
  });

  it('Should have initial select country value on resetSelectedCountry', () => {
    const initialSelectedCoountry = store.selectedCountry;
    store.resetSelectedCountry();
    const selectedCountryAfterReset = store.selectedCountry;
    expect(initialSelectedCoountry).toEqual(selectedCountryAfterReset);
  });

  it('Should update payment methods', () => {
    expect(store.paymentMethods.length).toBe(0);
    store.updatePaymentMethods(fake_payment_methods.payment_methods);
    expect(store.paymentMethods).toHaveLength(
      fake_payment_methods.payment_methods.length
    );
    expect(store.paymentMethods).toEqual(fake_payment_methods.payment_methods);
  });

  it('Should clear payment methods on resetPaymentMethods', () => {
    store.updatePaymentMethods(fake_payment_methods.payment_methods);
    expect(store.paymentMethods).toHaveLength(
      fake_payment_methods.payment_methods.length
    );
    store.clear();
    expect(store.paymentMethods.length).toBe(0);
  });

  it('Should have loading as fulsy by default', () => {
    expect(store.loading).toBeFalsy();
  });
  it('Should have loading as truthy on toggleLoading', () => {
    expect(store.loading).toBeFalsy();
    store.toggleLoading();
    expect(store.loading).toBeTruthy();
  });
});
