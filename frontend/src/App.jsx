import { Route, Routes } from "react-router-dom";
import CreateLink from "./roots/pages/CreateLink";
import Dashboard from "./roots/pages/Dashboard";
import Home from "./roots/pages/Home";
import LinkDetails from "./roots/pages/LinkDetails";
import RootLayout from "./roots/RootLayout.jsx";

function App() {
	return (
		<Routes>
			<Route element={<RootLayout/>}>
				<Route path='/' element={<Home />} />
				<Route path='/dashboard' element={<Dashboard />} />
				<Route path='/create-link' element={<CreateLink />} />
				<Route path='/links/:shortId' element={<LinkDetails />} />
				<Route path='*' element={<Home />} />
			</Route>
		</Routes>
	);
}

export default App;
