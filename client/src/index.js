import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";
import configureStore from "./redux/configureStore";
import axios from "axios";

// if (process.env.NODE_ENV === "production") {
//   axios.defaults.baseURL = `/api`;
// } else {
//   axios.defaults.baseURL = `http://localhost:4000/api`;
// }

const { store, persistor } = configureStore();

const app = (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));
