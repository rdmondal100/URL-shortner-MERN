import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { linkIcon, rightArrowIcon } from "../assets";
import { createShortUrl, setErrorMessage, setSubmitting } from "../store/urlSlice";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import urlSchemaValidation from "../schemaValidatino/urlSchemaValidation";
import { BiSolidErrorAlt } from "react-icons/bi";
import { useState } from "react";

const InputUrlBox = () => {
	const dispatch = useDispatch();
	const {
		register,
		handleSubmit,
    
		formState: { errors },
		reset,
    
	} = useForm({
    defaultValues:{urls:""}
    ,
		resolver: zodResolver(urlSchemaValidation),
	});


	const handleOnSubmit = (data) => {
    

    try {
      dispatch(setSubmitting(true))
      console.log(data.url);
      if (data.url) {
        dispatch(createShortUrl(data.url))
        reset();
      }
  
    } catch (error) {
      console.log(error)
      dispatch(setErrorMessage(error.message))
    }


	};

	return (
		<form
			onSubmit={handleSubmit(handleOnSubmit)}
			className='urlBox w-full  flex justify-center items-center relative max-w-[700px]'
		>
			<div className='flex w-full justify-center items-center relative '>
				{/* Left Icon */}
				<div className='bg-transparent cursor-pointer hover:bg-transparent absolute left-4'>
					<img
						src={linkIcon}
						alt='Link icon'
						className='w-5 md:w-6 lg:w-7'
					/>
				</div>
				{errors.url?.message && (
					<span className='text-red-600 absolute -top-8 text-center   w-full flex justify-center items-center gap-2 font-semibold'>
						<BiSolidErrorAlt />
						{errors.url?.message}
					</span>
				)}
				<Input
					type='url'
					{...register("url")}
					placeholder='Enter your looong URL here...'
					className={`rounded-full h-12 lg:h-[3.5rem] pl-14 ring focus:ring-2 
            ${errors.url ? "ring-red-600" : "focus:ring-blue-500"}
            w-full transition-all duration-300 bg-accent pr-6`}
				/>

				{/* Right Icon Button */}
				<Button
					type='submit'
					className='rounded-r-full shadow-xl shadow-primary/35  absolute right-0  h-full '
				>
					<div className='flex justify-center items-center gap-1 px-2 md:px-3'>
						<span className='hidden text-white lg:block'>
							Shorten Now
						</span>
						<img
							src={rightArrowIcon}
							alt='Arrow icon'
							className='md:w-6 w-5 mt-1  '
						/>
					</div>
				</Button>
			</div>
		</form>
	);
};

export default InputUrlBox;
