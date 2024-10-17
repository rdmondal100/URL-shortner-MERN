import {  getAllUrlsHistory } from "../store/urlSlice";
import { useEffect, useState } from "react";
import { copyIcon, downIcon } from "../assets";
import { useDispatch, useSelector } from "react-redux";
import timeAgo from "../utils/timesAgo";
import { baseDomain } from "./constants/baseDomain";

const HistoryOfAllUrls = () => {
	const [copiedId, setCopiedId] = useState(null);
	const [expandedId, setExpandedId] = useState(null);
	const { urlDetails, currentShortUrl } = useSelector(
		(state) => state.urlData
	);
	const dispatch = useDispatch();

	const handleCopyBtn = async (url, id) => {
		try {
      console.log(url)
      console.log(id)
			await navigator.clipboard.writeText(url);
			setCopiedId(id);

			setTimeout(() => {
				setCopiedId(null);
			}, 2000);
		} catch (error) {
			console.log("Failed to copy", error);
		}
	}

	console.log(urlDetails);

	useEffect(() => {
		dispatch(getAllUrlsHistory());
	}, [dispatch, currentShortUrl]);

	return (
		<div className='flex flex-col gap-3 w-full h-full'>
			<div className='titles m-auto flex items-center justify-between rounded-t-xl bg-accent h-16 w-[85vw]  px-5'>
				<span className=' w-[25%]'>Short URL</span>
				<div className=' w-[65%] justify-between items-center hidden lg:flex'>
					<span className=' w-[40%]'>Original URL</span>
					<span className=' w-[15%]'>Clicks</span>
					<span className=' w-[15%]'>Times</span>
				</div>
			</div>

			<div className='m-auto flex rounded-t-xl w-[85vw] flex-col gap-2 '>
				{urlDetails.map((item) => (
					<div
						key={item?._id}
						className='bg-muted/50 items-start lg:items-center flex flex-wrap py-3 lg:py-0 lg:h-14 w-full px-5   lg:w-[85vw] lg:justify-between transition-all duration-500 ease-in-out relative gap-1  '
					>
						<div
							className='p-2 rounded-full absolute right-1 cursor-pointer bg-accent lg:hidden'
							onClick={() =>
								setExpandedId(
									expandedId === item._id ? null : item._id
								)
							}
						>
							<img
								src={downIcon}
								alt=''
								className={`w-3 h-3 transition-transform duration-300 ${
									expandedId === item._id ? "rotate-180" : ""
								}`}
							/>
						</div>

						<div className='shortLink flex gap-3 w-full lg:w-[30%] items-center'>
							<div
								className={`cpy  cursor-pointer p-2 rounded-full  relative ${
									copiedId === item._id
										? "bg-green-600 hover:bg-green-600"
										: "bg-primary hover:bg-muted"
								}`}
								onClick={() => {
                  const shortUrl = `${baseDomain}${item.shortId}`
									handleCopyBtn(shortUrl, item._id);
								}}
							>
								<span
									className={`${
										copiedId === item._id
											? "scale-100"
											: "scale-0"
									} absolute text-[.7rem] -top-5 -right-2 bg-green-600 rounded-full px-2 transition-all duration-150 ease-linear`}
								>
									Copied
								</span>
								<img src={copyIcon} alt='' className=' w-4 ' />
							</div>

							<a
								href={`${baseDomain}${item.shortId}`}
								target='_blank'
								className='truncate-url'
                rel="noopener noreferrer"

								title={`${baseDomain}${item?.shortId}`}
							>
								{`${baseDomain}${item?.shortId}`}
							</a>
						</div>

						<div
							className={`overflow-hidden transition-all duration-500 ease-in-out lg:w-[65%] flex  items-center h-full justify-between flex-col gap-2 lg:flex-row lg:gap-0 mt-2 lg:mt-0 ml-10 lg:ml-0 ${
								expandedId === item._id
									? "max-h-[200px] opacity-100"
									: "max-h-0 lg:max-h-14 opacity-0 lg:opacity-100"
							} w-full transform origin-top `}
						>
							<div className='originalUrl w-full lg:w-[40%] '>
								<a
									href={item.redirectURL}
									target='_blank'
									className='truncate-url'
                  rel="noopener noreferrer"

								>
									{item.redirectURL}
								</a>
							</div>
							<div className='clicks  w-full lg:w-[15%] flex gap-1 items-center'>
								{item?.visitHistory?.length}
								<span className='text-sm'>Clicks</span>
							</div>
							<div className='date  w-full lg:w-[15%] text-sm'>
								{timeAgo(item.createdAt)}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default HistoryOfAllUrls;
