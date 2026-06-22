import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getAuthToken } from "../lib/auth";
import { loadCurrentUser } from "../store/authSlice";

const RootLayout = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		if (getAuthToken()) {
			dispatch(loadCurrentUser())
		}
	}, [dispatch]);
	return (
		<div className='relative min-h-screen overflow-hidden'>
			<div className='pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,hsl(var(--background)),hsl(var(--background)))]' />
			<Header />
			<main className='relative'>
				<Outlet />
			</main>
			<Footer />
		</div>
	);
};

export default RootLayout;
