import { moonIcon, sunIcon } from "../assets/index.js";

import { changeTheme } from "../store/urlSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";

export function ToggleTheme() {
	const dispatch = useDispatch();

	const { currentTheme } = useSelector((state) => state.urlData);
	const { setTheme } = useTheme();
	const handleThemeChange = () => {
		currentTheme === "light"
			? dispatch(changeTheme("dark"))
			: dispatch(changeTheme("light"));
	};

	useEffect(() => {
		setTheme(currentTheme);
	}, [currentTheme, setTheme]);

	return (
		<>
			<div
				className='toggle hidden md:block absolute  top-[50%] -right-24'
			>
				<div
					className='  flex w-[16rem] h-12  justify-between rounded-full   items-center  bg-accent rotate-90 cursor-pointer transition-all duration-300 ease-linear  relative border border-border  '
					onClick={handleThemeChange}
				>
					<div
						className={`light w-1/2 rounded-full h-full flex justify-center items-center  z-20 gap-4
          `}
					>
						<img src={sunIcon} alt='' className={`${currentTheme==="light"?"w-5":"w-4 "} transition-all duration-300 ease-in-out`} />
						<span className={`${currentTheme==="light" ? "font-bold text-foreground":"text-muted-foreground"} `}>Light</span>
					</div>
					<div
						className={`activeBg absolute w-[49%] bg-blue-600 h-[80%]  rounded-full z-10 transition-all duration-500 ease-in-out ${
							currentTheme === "light"
								? "translate-x-1"
								: "translate-x-full"
						}`}
					></div>
					<div
						className={`dark w-1/2 rounded-full h-full flex justify-center items-center  z-20 gap-3 `}
					>
						<img src={moonIcon} alt='' className={`${currentTheme==="dark"?"w-5":"w-4 "} transition-all duration-300 ease-in-out`} />
						<span className={`${currentTheme==="dark"?"font-bold text-foreground":"text-muted-foreground"} `}>Dark</span>
					</div>
				</div>
			</div>
		</>
	);
}
