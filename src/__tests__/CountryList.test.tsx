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
    const dropdown = screen.getByTestId("country-dropdown");   
    expect(dropdown).toBeTruthy()
  });

  it("Should render Get List button", () => {
    const button = screen.getByText("Get List");   
    expect(button).toBeTruthy()
  });

  it("Should render Clear button", () => {
    const button = screen.getByText("Clear");   
    expect(button).toBeTruthy()
  });

  it("Should not render payment methods table on first render", () => {
    const options = screen.getAllByRole("option");
    // console.log(options.length);
    expect(options.length).toBe(1);
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
    // expect(true).toBe(false)
    // const options = screen.getAllByRole("option");
    const dropdown = screen.getByTestId("country-dropdown");
    // console.log(dropdown.textContent);
    
    expect(dropdown.textContent).toBe('Please select a country')
  });

  it("Should render Clear button as disabled", () => {
    const button = screen.getByText("Clear")
    expect(button).toBeDisabled()
  });

  it("Should change the selected option properly", async () => {
    // const options = await screen.getAllByRole("option");
    // console.log(dropdown.textContent);
    
    // fireEvent.click(dropdown)
    // fireEvent.click(options[1])
    // // await screen.findByText('Clicked once')
    // // const options = await screen.getAllByRole("option");
    // console.log(options[1]);
    
    // fireEvent.click(options[1])
    // dropdown = await screen.getByTestId("country-dropdown");
    
    // console.log(dropdown.textContent);
    
    // expect(dropdown.textContent).toBeNot('Please select a country')
    


    // server.send(fake_residence_list);

    // const dropdown = screen.getByTestId("country-dropdown");
    // userEvent.selectOptions(dropdown, ["Zimbabwe"])
    
    // const option = screen.getByRole('options', {name: 'Zimbabwe'}) as HTMLOptionElement;
    // console.log(option);
    
    // expect(option.selected).toBe(true)



    server.send(fake_residence_list);
    const dropdown = screen.getByTestId("country-dropdown");
    console.log(dropdown.lastChild);
    
    const select = screen.getByRole("option", {
      name: "Zimbabwe - zw",
    }) as HTMLOptionElement;
    await userEvent.selectOptions(dropdown, select);
    expect(select.selected).toBeTruthy();
  });

  it("Should render Clear button as enabled after country selection", async () => {
    // expect(true).toBe(true)

    server.send(fake_residence_list);
    const dropdown = screen.getByTestId("country-dropdown");
    // console.log(dropdown.lastChild);
    
    const select = screen.getByRole("option", {
      name: "Zimbabwe - zw",
    }) as HTMLOptionElement;
    await userEvent.selectOptions(dropdown, select);

    const button = screen.getByText("Clear");   
    expect(button).toBeEnabled();
  });

  it("Should render the payment methods list on Get List button Click", async () => {
    // expect(true).toBe(true)

    server.send(fake_residence_list);
    const dropdown = screen.getByTestId("country-dropdown");
    const select = screen.getByRole("option", {
      name: "Zimbabwe - zw",
    }) as HTMLOptionElement;
    const button = screen.getByText("Get List");

    await userEvent.selectOptions(dropdown, select);
    expect(select.selected).toBeTruthy();

    server.send(fake_payment_methods);
    await userEvent.click(button);
    const table = screen.queryByRole("table");
    expect(table).toBeTruthy();
  });

  it("Should clear dropdown on Clear button Click", async () => {
    // expect(true).toBe(true)
    server.send(fake_residence_list);
    const dropdown = screen.getByTestId("country-dropdown");
    const select = screen.getByRole("option", {
      name: "Zimbabwe - zw",
    }) as HTMLOptionElement;
    const button = screen.getByText("Clear");

    await userEvent.selectOptions(dropdown, select);
    expect(select.selected).toBeTruthy();

    expect(button).toBeEnabled();
    await userEvent.click(button);
    expect(button).toBeDisabled();
    expect(select.selected).toBeFalsy();
    
    const selectPlaceholder = screen.getByRole("option", {
      name: "Please select a country",
    }) as HTMLOptionElement;
    expect(selectPlaceholder.selected).toBeTruthy();
  });
});
