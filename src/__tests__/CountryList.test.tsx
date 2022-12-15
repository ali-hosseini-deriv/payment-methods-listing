import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
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
    const dropdown = screen.getByTestId("country-dropdown");
    expect(dropdown).toBeInTheDocument();
  });

  it("Should render Get List button", () => {
    const listButton = screen.getByRole("button", { name: /Get List/ });
    expect(listButton).toBeInTheDocument();
  });

  it("Should render Clear button", () => {
    const clearButton = screen.getByRole("button", { name: /Clear/ });
    expect(clearButton).toBeInTheDocument();
  });

  it("Should not render payment methods table on first render", () => {
    const table = screen.queryByRole("table");
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

  //  it("Should have placeholder option as selected", () => {
  //    expect(true).toBe(false)
  //  });
  //
  it("Should render Clear button as disabled", () => {
    const clearButtonDisabled = screen.getByRole("button", { name: /Clear/ });
    expect(clearButtonDisabled).toBeDisabled();
  });

  it("Should change the selected option properly", async () => {
    server.send(fake_residence_list);
    const dropdown = screen.getByTestId("country-dropdown");
    const defaultPlaceHolder = screen.getByRole("option", {
      name: "Please select a country",
    }) as HTMLOptionElement;
    const isZimbabwe = screen.getByRole("option", {
      name: "Zimbabwe - zw",
    }) as HTMLOptionElement;
    await userEvent.selectOptions(dropdown, isZimbabwe);
    expect(isZimbabwe.selected).toBeTruthy();
    expect(defaultPlaceHolder.selected).toBeFalsy();
  });

  it("Should render Clear button as enabled after country selection", async () => {
    server.send(fake_residence_list);
    fireEvent.change(screen.getByTestId("country-dropdown"), {
      target: { value: "zw" },
    });
    expect(screen.getByRole("button", { name: /Clear/ })).toBeEnabled();
  });

  it("Should render the payment methods list on Get List button Click", async () => {
    server.send(fake_residence_list);
    fireEvent.change(screen.getByTestId("country-dropdown"), {
      target: { value: "id" },
    });
    expect(screen.getByRole("button", { name: /Get List/ }));
    server.send(fake_payment_methods);
    expect(screen.getByTestId("table-body")).toBeInTheDocument();
  });

  it("Should clear dropdown on Clear button Click", async () => {
    const clearButtonDisabled = screen.getByRole("button", { name: /Clear/ });
    expect(clearButtonDisabled).toBeDisabled();
    server.send(fake_residence_list);
    fireEvent.change(screen.getByTestId("country-dropdown"), {
      target: { value: "id" },
    });
    expect(screen.getByRole("button", { name: /clear/i })).toBeEnabled();
  });
});
