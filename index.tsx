import React from "react";
import { registerRootComponent } from "expo";
import { Provider } from "react-redux";
import StackNavigation from "./app/navigations/StackNavigation";
import { store } from "./app/redux/store";
import { Text as RNText, TextProps } from "react-native"; // Import Text component from react-native

// Custom Text component to disable font scaling globally
const Text = (props: TextProps) => {
  console.log("Custom Text component rendering");
  return <RNText {...props} allowFontScaling={false} />;
};

const App = () => {
  console.log("App component rendering");
  return (
    <Provider store={store}>
      <StackNavigation />
    </Provider>
  );
};

// Register the root component of the app
console.log("Registering root component");
registerRootComponent(App);
