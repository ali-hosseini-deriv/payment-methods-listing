import { observer } from "mobx-react-lite";
import { MutableRefObject } from "react";
import useApi from "../hooks/useApi";
import useStore from "../hooks/useStore";

type TCountryListProps = {
  websocket: MutableRefObject<WebSocket | undefined>;
};

const CountryList = ({ websocket }: TCountryListProps) => {
  const store = useStore();
  const {
    updateSelectedCountry,
    resetPaymentMethods,
    resetSelectedCountry,
    countryListStore,
    selectedCountry,
    loading,
    paymentMethods,
  } = store;

  const { send } = useApi({ websocket });

  const onGetListClicked = () => {
    if (selectedCountry.value !== "") {
      send({
        payment_methods: 1,
        country: selectedCountry.value,
      });
    }
  };
  const onClearClicked = () => {
    resetPaymentMethods();
    resetSelectedCountry();
  };

  return (
    <article>
      <section>
        {loading && <div className="loading">Loading&#8230;</div>}
        <select
          className=""
          data-testid="country-dropdown"
          value={selectedCountry.value}
          onChange={(e) => {
            const item = countryListStore.find(
              (item) => item.value === e.target.value
            )!!;
            updateSelectedCountry(item);
          }}
        >
          <option value="" disabled>
            Please select a country
          </option>
          {store?.countryListStore?.map((c) => {
            return (
              <option key={c?.text} value={c?.value}>
                {`${c?.text} - ${c?.value}`}
              </option>
            );
          })}
        </select>
        <button onClick={onGetListClicked} disabled={!selectedCountry.value}>
          Get List
        </button>
        <button onClick={onClearClicked} disabled={!selectedCountry.value}>
          Clear
        </button>
      </section>
      {paymentMethods.length ? (
        <section>
          <table>
            <thead>
              <tr>
                <th>Display Name</th>
                <th>Supported Currencies</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody data-testid="table-body">
              {store?.paymentMethods?.map((item) => (
                <tr key={item.id}>
                  <td>{item?.display_name}</td>
                  <td>{item?.supported_currencies?.join(",")}</td>
                  <td>{item?.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}
    </article>
  );
};

export default observer(CountryList);
