import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import WS from "jest-websocket-mock";
import CountryList from "../Components/CountryList";
import { fake_payment_methods } from "./fakes/payment_methods";
import { fake_residence_list } from "./fakes/residence_list";

describe("Payment Method", () => {
  let server: WS;
  let user: UserEvent;
  let client: WebSocket;

  const getCountriesList = async () => {
    server.send(fake_residence_list);
    const options = screen.getAllByRole("option");
    await waitFor(() => {
      expect(options.length).toBe(
        fake_residence_list.residence_list.length + 1
      );
    });
  };

  beforeEach(async () => {
    user = userEvent.setup();
    server = new WS("wss://ws.binaryws.com/websockets/v3?app_id=1089", {
      jsonProtocol: true,
    });
    client = new WebSocket("wss://ws.binaryws.com/websockets/v3?app_id=1089");
    render(<CountryList websocket={{ current: client }} />);
  });

  afterEach(() => {
    WS.clean();
    cleanup();
  });

  it("Should render Country Dropdown", () => {
    expect(screen.getByTestId("country-dropdown")).toBeInTheDocument();
  });

  it("Should render Get List button", () => {
    expect(
      screen.getByRole("button", {
        name: /get list/i,
      })
    ).toBeInTheDocument();
  });

  it("Should render Clear button", () => {
    expect(
      screen.getByRole("button", {
        name: /clear/i,
      })
    ).toBeInTheDocument();
  });

  it("Should not render payment methods table on first render", () => {
    expect(screen.queryByTestId("table-body")).not.toBeInTheDocument();
  });

  it("Should get residence list on first render from websocket server", async () => {
    await expect(server).toReceiveMessage({ residence_list: 1 });
  });

  it("Should render the options list properly", async () => {
    server.send(fake_residence_list);
    const options = screen.getAllByRole("option");
    expect(options.length).toBe(fake_residence_list.residence_list.length + 1);
  });

  it("Should have placeholder option as selected", async () => {
    await getCountriesList();

    const selected_value = screen.getByRole("option", {
      name: /please select a country/i,
    }) as HTMLOptionElement;

    await userEvent.selectOptions(screen.getByRole("combobox"), "");
    expect(selected_value.selected).toBe(true);
  });

  it("Should render Clear button as disabled", () => {
    expect(
      screen.getByRole("button", {
        name: /clear/i,
      })
    ).toBeDisabled();
  });

  it("Should change the selected option properly", async () => {
    await getCountriesList();

    const selected_value = screen.getByRole("option", {
      name: /indonesia \- id/i,
    }) as HTMLOptionElement;

    await userEvent.selectOptions(screen.getByRole("combobox"), "id");
    expect(selected_value.selected).toBe(true);
  });

  it("Should render Clear button as enabled after country selection", async () => {
    await getCountriesList();

    const selected_value = screen.getByRole("option", {
      name: /indonesia \- id/i,
    }) as HTMLOptionElement;

    await userEvent.selectOptions(screen.getByRole("combobox"), "id");
    expect(selected_value.selected).toBe(true);

    expect(
      screen.getByRole("button", {
        name: /clear/i,
      })
    ).toBeEnabled();
  });

  it("Should render the payment methods list on Get List button Click", async () => {
    await getCountriesList();

    const selected_value = screen.getByRole("option", {
      name: /india \- in/i,
    }) as HTMLOptionElement;

    await userEvent.selectOptions(screen.getByRole("combobox"), "in");

    const get_list_button = screen.getByRole("button", { name: /get list/i });

    server.send(fake_payment_methods);
    await userEvent.click(get_list_button);
    const table = screen.queryByRole("table");
    expect(table).toBeInTheDocument();
  });

  it("Should clear dropdown on Clear button Click", async () => {
    await getCountriesList();

    const selected_country = screen.getByRole("option", {
      name: /india \- in/i,
    }) as HTMLOptionElement;

    await userEvent.selectOptions(screen.getByRole("combobox"), "in");

    const get_list_button = screen.getByRole("button", { name: /get list/i });

    server.send(fake_payment_methods);
    await userEvent.click(get_list_button);
    expect(screen.queryByRole("table")).toBeInTheDocument();

    const clear_button = screen.getByRole("button", {
      name: /clear/i,
    });

    await userEvent.click(clear_button);

    expect(selected_country.selected).toBe(false);
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});
