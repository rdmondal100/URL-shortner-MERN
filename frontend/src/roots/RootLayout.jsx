import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { cubesImg, cubesImgLight, homeBg } from "../assets";
import { useSelector } from "react-redux";

const RootLayout = () => {
	const { currentTheme } = useSelector((state) => state.urlData);
	return (
		<>
			<Header />
			<div className='backgroundImg absolute inset-0 w-full h-full -z-50 overflow-hidden'>
				<img
					src={homeBg}
					alt='Background'
					className='absolute top-0 left-0 w-full h-full object-cover animate-slow-rotate -z-50 opacity-80'
				/>
				<img
					src={currentTheme === "light" ? cubesImgLight : cubesImg}
					alt='Cubes'
					className='absolute top-0 left-0 w-full h-full object-fill opacity-40 -z-40'
				/>
			</div>
			<main>
				<Outlet />
			</main>
			<Footer />
		</>
	);
};

export default RootLayout;
