import React, { useEffect } from "react";
import { registerRootComponent } from "expo";
import { Provider } from "react-redux";
import StackNavigation from "./app/navigations/StackNavigation";
import { store } from "./app/redux/store";

const App = () => {
  return (
    <Provider store={store}>
      <StackNavigation />
    </Provider>
  );
};

// Register the root component of the app
registerRootComponent(App);