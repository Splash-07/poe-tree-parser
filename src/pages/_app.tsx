import type { AppProps } from "next/app";
import { store } from "../lib/store/store";
import "../styles/global.css";
import { Provider } from "react-redux";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
