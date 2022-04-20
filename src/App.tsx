import { Provider } from "react-redux";
import TreeStage from "./components/TreeStage";
import { store } from "./lib/store/store";
import "./styles/global.css";
function App() {
  return (
    <Provider store={store}>
      <TreeStage />
    </Provider>
  );
}

export default App;
