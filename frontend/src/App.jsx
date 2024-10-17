import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./roots/pages/Home";
import RootLayout from "./roots/pages/rootLayout";

function App() {
	return (
		<Routes>
			<Route element={<RootLayout />}>
				<Route path='/' element={<Home />} />
			</Route>
		</Routes>
	);
}

export default App;
