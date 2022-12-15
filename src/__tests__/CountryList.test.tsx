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
    const dropdown = screen.getAllByTestId("country-dropdown");
    expect(dropdown).toBeInTheDocument();
  });

  it("Should render Get List button", () => {
    const GetListButton = screen.getByText("Get List");
    expect(GetListButton).toBeInTheDocument();
  });

  it("Should render Clear button", () => {
    const clearButton = screen.getByText("Clear");
    expect(clearButton).toBeInTheDocument();
  });

  it("Should not render payment methods table on first render", () => {
    const table = screen.queryByTestId("table-body");
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
    const dropdown = screen.getByTestId("country-dropdown");
    expect(dropdown.value).toBe("");
  });

  it("Should render Clear button as disabled", () => {
    const button = screen.getByText(/Clear/);
    expect(button.disabled).toBe(true);
  });

  it("Should change the selected option properly", async () => {
    server.send(fake_residence_list);
    const dropdown = screen.getByTestId("country-dropdown");
    userEvent.selectOptions(dropdown, "Afghanistan - af");
    expect(dropdown.value).toBe("Afghanistan - af");
  });

  it("Should render Clear button as enabled after country selection", async () => {
    server.send(fake_residence_list);
    const options_list = screen.getAllByRole("option");
    const clearBtn = screen.getByTestId("clear-button");
    await user.selectOptions(options_list[1]);
    expect(clearBtn.hasAttribute("disabled")).toBe(false);
  });

  it("Should render the payment methods list on Get List button Click", async () => {
    server.send(fake_residence_list);
    const options_list = screen.getAllByRole("option");
    const getListBtn = screen.getByTestId("get-list-button");
    await user.selectOptions(options_list[1]);
    user.click(getListBtn);
    server.send(fake_payment_methods);
    expect(screen.getByTestId("payment-methods-list")).toBeInTheDocument();
  });

  it("Should clear dropdown on Clear button Click", async () => {
    server.send(fake_residence_list);
    const options_list = screen.getAllByRole("option");
    const btn_clear = screen.getByTestId("clear-button");
    await user.selectOptions(options[1]);
    user.click(btn_clear);
    expect(screen.getByTestId("country-list").value).toBe("");
  });
});
