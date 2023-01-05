import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import PaymentMethodStore from "./store/PaymentMethod.store";
import {observer} from "mobx-react";

const store = new PaymentMethodStore();
const AppWithStore = observer(({store}: { store: PaymentMethodStore }) => <App store={store}/>)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <AppWithStore store={store}/>
    </React.StrictMode>,
)
