import { MoonStar, SunMedium } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { useTheme } from "@/components/ThemeProvider"
import { changeTheme } from "../store/urlSlice"

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
		<button
			type='button'
			className='inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent'
			onClick={handleThemeChange}
		>
			{currentTheme === "light" ? (
				<SunMedium className='h-4 w-4 text-primary' />
			) : (
				<MoonStar className='h-4 w-4 text-primary' />
			)}
			<span>{currentTheme === "light" ? "Light" : "Dark"}</span>
		</button>
	);
}
