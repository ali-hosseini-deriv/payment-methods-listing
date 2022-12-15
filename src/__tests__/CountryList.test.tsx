import { cleanup, render, screen, within, fireEvent } from "@testing-library/react";
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
    const dropdown = screen.getByTestId("country-dropdown")
    expect(dropdown).toBeInTheDocument();
  });

  it("Should render Get List button", () => {
    const listButton = screen.getByRole("button", {
      name: /get list/i
    })
    expect(listButton).toBeInTheDocument()
  });

  it("Should render Clear button", () => {
    const clearButton = screen.getByRole("button", {
      name: /Clear/i
    })
    expect(clearButton).toBeInTheDocument()
  });

  it("Should not render payment methods table on first render", () => {
    const table = screen.queryByRole("table")
    expect(table).not.toBeInTheDocument();
  });

  it("Should get residence list on first render from websocket server", async () => {
    await expect(server).toReceiveMessage({ residence_list: 1 });
  });

  it("Should render the options list properly", async () => {
    server.send(fake_residence_list);
    const options = screen.getAllByRole("option");
    expect(options.length).toBe(fake_residence_list.residence_list.length + 1);
  });

  it("Should have placeholder option as selected", () => {
    const placeholder = screen.getByRole("option", {
      name: /Please select a country/i
    })
    expect(placeholder).toBeInTheDocument();
  });

  it("Should render Clear button as disabled", () => {
    const clearButton = screen.getByRole("button", {
      name: /Clear/i
    })
    expect(clearButton).toBeDisabled();
  });

  it("Should change the selected option properly", async () => {
    await server.send(fake_residence_list);
    const dropdown: HTMLSelectElement = screen.getByTestId("country-dropdown")
    const selected_country: HTMLOptionElement = screen.getByRole("option", {
      name: "Indonesia - id"
    })
    // const select_placeholder_option = screen.getByRole("sel", {
    //   name: "Please select a country",
    // }) as HTMLOptionElement;
    await userEvent.selectOptions(dropdown, selected_country)
    // await userEvent.selectOptions(select_placeholder_option, "id");
    expect(selected_country.selected).toBe(true);
  });

  it("Should render Clear button as enabled after country selection", async () => {
    await server.send(fake_residence_list);
    const dropdown: HTMLSelectElement = screen.getByTestId("country-dropdown")
    const selected_country: HTMLOptionElement = screen.getByRole("option", {
      name: "Indonesia - id"
    })
    await userEvent.selectOptions(dropdown, selected_country)
    const clearButton = screen.getByRole("button", {
      name: "Clear"
    })
    expect(clearButton).toBeEnabled()
  });

  it("Should render the payment methods list on Get List button Click", async () => {
    await server.send(fake_residence_list);
    const dropdown: HTMLSelectElement = screen.getByTestId("country-dropdown")
    const selected_country: HTMLOptionElement = screen.getByRole("option", {
      name: "Indonesia - id"
    })

    await userEvent.selectOptions(dropdown, selected_country)
    const listButton = screen.getByRole("button", {
      name: "Get List"
    })
    await userEvent.click(listButton)
    await server.send(fake_payment_methods)
    expect(screen.getByRole("table")).toBeInTheDocument()

  });

  it("Should clear dropdown on Clear button Click", async () => {
    await server.send(fake_residence_list);
    const dropdown: HTMLSelectElement = screen.getByTestId("country-dropdown")
    const selected_country: HTMLOptionElement = screen.getByRole("option", {
      name: "Indonesia - id"
    })

    await userEvent.selectOptions(dropdown, selected_country)
    const listButton = screen.getByRole("button", {
      name: "Get List"
    })
    await userEvent.click(listButton)
    await server.send(fake_payment_methods)
    const placeholder = screen.getByRole("option", {
      name: /Please select a country/i
    })
    const clearButton = screen.getByRole("button", {
      name: "Clear"
    })
    await userEvent.click(clearButton)
    const table = screen.queryByTestId("table-body")
    expect(table).toBeNull();
  });
});
