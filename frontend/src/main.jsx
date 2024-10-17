import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider.jsx";

createRoot(document.getElementById("root")).render(
	<Provider store={store}>
		<BrowserRouter>
      <ThemeProvider>
			<App />
      </ThemeProvider>
		</BrowserRouter>
	</Provider>
);
