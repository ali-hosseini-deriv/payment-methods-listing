import { cleanup, render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup"
import WS from "jest-websocket-mock"
import CountryList from "../Components/CountryList"
import { fake_payment_methods } from "./fakes/payment_methods"
import { fake_residence_list } from "./fakes/residence_list"

describe("Payment Method", () => {
  let server: WS
  let user: UserEvent
  let client: WebSocket

  beforeEach(async () => {
    user = userEvent.setup()
    server = new WS("wss://ws.binaryws.com/websockets/v3?app_id=1089", {
      jsonProtocol: true,
    })
    client = new WebSocket("wss://ws.binaryws.com/websockets/v3?app_id=1089")
    render(<CountryList websocket={{ current: client }} />)
  })

  afterEach(() => {
    WS.clean()
    cleanup()
  })

  it("Should render Country Dropdown", () => {
    expect(screen.getByText("Please select a country")).toBeInTheDocument()
  })

  it("Should render Get List button", () => {
    expect(screen.getByText("Get List")).toBeInTheDocument()
  })

  it("Should render Clear button", () => {
    expect(screen.getByText("Clear")).toBeInTheDocument()
  })

  it("Should not render payment methods table on first render", async () => {
    const get_button = screen.getByText("Get List")

    await user.click(get_button)
    expect(
      screen.queryByText(
        "DP2P is Deriv's peer-to-peer deposit and withdrawal service"
      )
    ).not.toBeInTheDocument()
  })

  it("Should get residence list on first render from websocket server", async () => {
    await expect(server).toReceiveMessage({ residence_list: 1 })
  })

  it("Should render the options list properly", async () => {
    server.send(fake_residence_list)
    const options = screen.getAllByRole("option")
    expect(options.length).toBe(fake_residence_list.residence_list.length + 1)
  })

  it("Should have placeholder option as selected", async () => {
    server.send(fake_residence_list)
    const selector = screen.getByText("Please select a country")

    await user.click(selector)
    expect(screen.getByText("India - in")).toBeInTheDocument()
  })

  it("Should render Clear button as disabled", () => {
    const clear_button = screen.getByText("Clear")
    expect(clear_button.disabled).toBe(true)
  })

  it("Should change the selected option properly", async () => {
    server.send(fake_residence_list)

    const select_placeholder_option = screen.getByRole("option", {
      name: "Zimbabwe - zw",
    }) as HTMLOptionElement

    await userEvent.selectOptions(
      screen.getByTestId("country-dropdown"),
      select_placeholder_option
    )

    expect(select_placeholder_option.selected).toBe(true)
  })

  it("Should render Clear button as enabled after country selection", async () => {
    server.send(fake_residence_list)
    const india_option = screen.getByText("India - in")
    const clear_button = screen.getByText("Clear")
    const selector = screen.getByText("Please select a country")

    await user.click(selector)
    await user.click(india_option)
    await user.click(clear_button)
    expect(screen.getByText("Please select a country")).toBeInTheDocument()
  })

  it("Should render the payment methods list on Get List button Click", async () => {
    server.send(fake_residence_list)
    const india_option = screen.getByText("India - in")
    const selector = screen.getByText("Please select a country")

    await user.click(selector)
    await user.click(india_option)

    server.send(fake_payment_methods)

    expect(screen.getByText("USD")).toBeInTheDocument()
  })

  it("Should clear dropdown on Clear button Click", async () => {
    server.send(fake_residence_list)
    const india_option = screen.getByText("India - in")
    const clear_button = screen.getByText("Clear")
    const selector = screen.getByText("Please select a country")

    await user.click(selector)
    await user.click(india_option)

    expect(screen.getByText("India - in")).toBeInTheDocument()
    await user.click(clear_button)
    expect(screen.getByText("Please select a country")).toBeInTheDocument()
  })
})
