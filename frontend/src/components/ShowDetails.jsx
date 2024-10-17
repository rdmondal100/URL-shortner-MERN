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
				<div className='detailsContainer mt-10 w-full justify-center items-center flex '>
					<div className='url text-center h-12 w-auto px-5 py-3 bg-accent  rounded-full flex justify-center items-center gap-5 relative pr-16'>
						<a
							href={`${baseDomain}${currentShortUrl?.shortId}`}
							target='_blank'
							className=' hover:text-primary'
						>
							{`${baseDomain}${currentShortUrl?.shortId}`}
						</a>
						<span
							className={` cursor-pointer  h-full w-16 rounded-r-full flex justify-center items-center absolute -right-5 group hover:bg-green-600 ${
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
