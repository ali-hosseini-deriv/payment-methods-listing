import React, { useCallback, useEffect, useState } from "react";
import { IPaymentMethod, IResidenceItem } from "./types";

type TCountryListProps = {
  websocket: React.MutableRefObject<WebSocket | undefined>;
};

const CountryList = ({ websocket }: TCountryListProps) => {
  const [selected_country, setSelectedCountry] =
    useState<IResidenceItem["value"]>("");
  const [countries, setCountries] = useState<IResidenceItem[]>([]);
  const [payment_methods, setPaymentMethods] = useState<IPaymentMethod[]>([]);

  const send = useCallback(
    (message: object) => {
      if (websocket.current?.readyState === 1) {
        websocket?.current?.send(JSON.stringify(message));
      }
    },
    [websocket]
  );

  useEffect(() => {
    websocket.current?.addEventListener("open", () => {
      send({ residence_list: 1 });
    });

    websocket.current?.addEventListener("message", (message) => {
      const data = JSON.parse(message.data);

      switch (data.msg_type) {
        case "residence_list":
          setCountries(data?.residence_list);
          break;
        case "payment_methods":
          setPaymentMethods(data?.payment_methods);
          break;
      }
    });

    return () => {
      if ([0, 1].includes(websocket?.current?.readyState || 3)) {
        websocket?.current?.close();
      }
    };
  }, []);

  const onGetListClicked = () => {
    if (selected_country !== "") {
      send({
        payment_methods: 1,
        country: selected_country,
      });
    }
  };

  const onClearClicked = () => {
    setSelectedCountry("");
    setPaymentMethods([]);
  };

  return (
    <article>
      <section>
        <select
          className=""
          data-testid="country-dropdown"
          value={selected_country}
          onChange={(e) => {
            setSelectedCountry(e.target.value);
          }}
        >
          <option value="" disabled>
            Please select a country
          </option>
          {countries.map((c) => {
            return (
              <option key={c?.text} value={c?.value}>
                {`${c?.text} - ${c?.value}`}
              </option>
            );
          })}
        </select>
        <button onClick={onGetListClicked}>Get List</button>
        <button onClick={onClearClicked} disabled={!selected_country}>
          Clear
        </button>
      </section>
      {payment_methods.length ? (
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
              {payment_methods?.map((item) => (
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

export default CountryList;
