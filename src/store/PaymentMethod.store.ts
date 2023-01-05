import { makeAutoObservable } from "mobx";
import { IPaymentMethod, IResidenceItem } from "../Components/types";

export const selectedCountryInitValue = { text: "", value: "", phone_idd: "" };

class PaymentMethodStore {
  countryListStore: IResidenceItem[] = [];
  paymentMethods: IPaymentMethod[] = [];
  selectedCountry: IResidenceItem = selectedCountryInitValue;
  loading = false;
  constructor() {
    makeAutoObservable(this);
  }

  toggleLoading = () => {
    this.loading = !this.loading;
  };
  updatePaymentMethods = (pms: IPaymentMethod[]) => {
    this.paymentMethods = pms;
  };
  updateSelectedCountry = (residence: IResidenceItem) => {
    this.selectedCountry = residence;
  };
  updateCountryList = (countryList: IResidenceItem[]) => {
    this.countryListStore = countryList;
  };

  resetPaymentMethods = () => {
    this.paymentMethods = [];
  };

  resetSelectedCountry = () => {
    this.selectedCountry = selectedCountryInitValue;
  };

  clear = () => {
    this.countryListStore = [];
    this.paymentMethods = [];
    this.selectedCountry = selectedCountryInitValue;
    this.loading = false;
  };
}

export default PaymentMethodStore;
