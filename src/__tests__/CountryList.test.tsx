import { cleanup, render, screen, within } from "@testing-library/react";
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
    const countryDropdown = screen.getByTestId("country-dropdown");
    expect(countryDropdown).toBeInTheDocument();
  });

  it("Should render Get List button", () => {
    const getListButton = screen.getByRole("button", { 
      name: /get list/i 
    });
    expect(getListButton).toBeInTheDocument();
  });

  it("Should render Clear button", () => {
    const clearButton = screen.getByRole("button", { 
      name: /clear/i 
    });
    expect(clearButton).toBeInTheDocument();
  });

  it("Should not render payment methods table on first render", () => {
    const methodTable = screen.queryByRole("table");
    expect(methodTable).not.toBeInTheDocument();
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
    server.send(fake_residence_list);
    const countryDropdown = screen.getByTestId("country-dropdown");
    const selectPlaceholderOption = screen.getByRole("option", {
      name: "Please select a country",
    }) as HTMLOptionElement;
    await userEvent.selectOptions(countryDropdown, selectPlaceholderOption);
    expect(selectPlaceholderOption.selected).toBeTruthy();
  });

  it("Should render Clear button as disabled", () => {
    const clearButton = screen.getByRole("button", { 
      name: /clear/i 
    });
    expect(clearButton).toBeDisabled();
  });

  it("Should change the selected option properly", async () => {
    server.send(fake_residence_list);
    const countryDropdown = screen.getByTestId("country-dropdown");
    const selectPlaceholderOption = screen.getByRole("option", {
      name: "Please select a country",
    }) as HTMLOptionElement;
    const countryOption = screen.getByRole("option", {
      name: "Germany - de",
    }) as HTMLOptionElement;
    await userEvent.selectOptions(countryDropdown, countryOption);
    expect(countryOption.selected).toBeTruthy();
    expect(selectPlaceholderOption.selected).toBeFalsy();
  });

  it("Should render Clear button as enabled after country selection", async () => {
    server.send(fake_residence_list);
    const countryDropdown = screen.getByTestId("country-dropdown");
    const selectPlaceholderOption = screen.getByRole("option", {
      name: "Please select a country",
    }) as HTMLOptionElement;
    const countryOption = screen.getByRole("option", {
      name: "Germany - de",
    }) as HTMLOptionElement;
    const clearButton = screen.getByRole("button", { 
      name: /clear/i 
    });

    await userEvent.selectOptions(countryDropdown, countryOption);
    expect(countryOption.selected).toBeTruthy();
    expect(selectPlaceholderOption.selected).toBeFalsy();
    expect(clearButton).toBeEnabled();
  });

  it("Should render the payment methods list on Get List button Click", async () => {
    server.send(fake_residence_list);
    const countryDropdown = screen.getByTestId("country-dropdown");
    const countryOption = screen.getByRole("option", {
      name: "Germany - de",
    }) as HTMLOptionElement;
    const getListButton = screen.getByRole("button", { name: /get list/i });

    await userEvent.selectOptions(countryDropdown, countryOption);
    expect(countryOption.selected).toBeTruthy();

    server.send(fake_payment_methods);
    await userEvent.click(getListButton);
    const table = screen.queryByRole("table");
    expect(table).toBeInTheDocument();
  });

  it("Should clear dropdown on Clear button Click", async () => {
    server.send(fake_residence_list);
    const countryDropdown = screen.getByTestId("country-dropdown");
    const selectPlaceholderOption = screen.getByRole("option", {
      name: "Please select a country",
    }) as HTMLOptionElement;
    const countryOption = screen.getByRole("option", {
      name: "Germany - de",
    }) as HTMLOptionElement;
    await userEvent.selectOptions(countryDropdown, countryOption);
    expect(countryOption.selected).toBeTruthy();
    expect(selectPlaceholderOption.selected).toBeFalsy();

    const clearButton = screen.getByRole("button", { 
      name: /clear/i 
    });
    await userEvent.click(clearButton);
    expect(countryOption.selected).toBeFalsy();
    expect(selectPlaceholderOption.selected).toBeTruthy();
  });
});
