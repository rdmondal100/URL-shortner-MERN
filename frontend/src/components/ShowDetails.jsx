import { useSelector } from "react-redux";
import { copyIcon } from "../assets";
import { useState } from "react";
import { baseDomain } from "./constants/baseDomain";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";

const ShowDetails = () => {
	const { currentShortUrl } = useSelector((state) => state.urlData);

	const [copid, setCopied] = useState(false);
	const handleCopyBtn = async (url) => {
		try {
			console.log(url);
			await navigator.clipboard.writeText(url);
			setCopied(true);
			setTimeout(() => {
				setCopied(false);
			}, 2000);
		} catch (error) {
			console.log("Failed to copy", error);
		}
	};

	return (
		<>
			{currentShortUrl._id && (
				<div className=' w-[90vw] justify-center items-center flex  relative'>
					<div className=' h-12 w-[80%] max-w-[500px] px-5 py-3 lg:h-[3.3rem] bg-accent  rounded-full flex justify-start items-center  relative '>
						<a
							href={`${baseDomain}${currentShortUrl?.shortId}`}
							target='_blank'
							className=' hover:text-primary text-start w-[85%] text-sm md:text-base truncate-url'
						>
							{`${baseDomain}${currentShortUrl?.shortId}`}
						</a>
						<span
							className={` cursor-pointer  h-full w-[20%] max-w-16 rounded-r-full flex justify-center items-center absolute  right-0 group hover:bg-green-600 ${
								copid ? "bg-green-600" : "bg-primary"
							}`}
							onClick={() =>
								handleCopyBtn(
									`${baseDomain}${currentShortUrl?.shortId}`
								)
							}
						>
							<span
								className={`${
									copid ? " scale-100 " : " scale-0"
								} transition-all duration-300 ease-in-out absolute -top-6 bg-green-600 px-2 rounded-full text-[.7rem]`}
							>
								Copied
							</span>
							<div className='icon-cpy relative transition-transform duration-500 ease-linear flex justify-center items-center'>
								{/* Copy Icon */}
								<img
									src={copyIcon}
									alt=''
									className={`w-4  inset-0 transition-transform duration-500 ease-linear transform ${
										copid ? "scale-0" : "scale-100"
									}`}
								/>
								{/* Done Icon */}
								<IoCheckmarkDoneCircleSharp
									className={`text-lg text-white absolute inset-0 transition-transform duration-500 ease-linear transform ${
										copid ? "scale-100" : "scale-0"
									}`}
								/>
							</div>
						</span>
					</div>
				</div>
			)}
		</>
	);
};

export default ShowDetails;
