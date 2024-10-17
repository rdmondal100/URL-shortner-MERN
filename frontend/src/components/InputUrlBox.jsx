
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { linkIcon, rightArrowIcon } from "../assets";
import { createShortUrl } from "../store/urlSlice";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import urlSchemaValidation from "../schemaValidatino/urlSchemaValidation";

const InputUrlBox = () => {
  const dispatch = useDispatch();

  const { register, handleSubmit, formState: { errors }, reset,watch } = useForm({
    resolver: zodResolver(urlSchemaValidation),
  });

  const isUrl = watch("url");

  const handleOnSubmit = (data) => {
    console.log(data.url);
    if (data.url) {
      dispatch(createShortUrl(data.url));
      reset();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleOnSubmit)}
      className="urlBox w-[90vw] flex justify-center px-2"
    >
      <div className="flex w-[90vw] max-w-2xl justify-center items-center -space-x-12 relative">
        {/* Left Icon */}
        <div className="bg-transparent cursor-pointer hover:bg-transparent relative -left-1">
          <img src={linkIcon} alt="Link icon" className="w-5 md:w-6 lg:w-8 xl:w-10" />
        </div>
        {errors.url?.message && !isUrl && (
                    <span className='text-red-600 absolute -top-8 text-center   w-full'>{errors.url?.message} !!</span>
                )}
        <Input
          type="url"
          {...register("url", { required: "URL is required!" })}
          placeholder="Enter your looong URL here..."
          className={`rounded-full h-12 lg:h-[3.5rem] pl-14 ring focus:ring-2 
            ${errors.url ? 'ring-red-600' : 'focus:ring-blue-500'}
            md:w-[60vw] lg:w-[70vw] transition-all duration-300 bg-accent pr-6`}
        />
      

        {/* Right Icon Button */}
        <Button
          type="submit"
          className="rounded-full shadow-xl shadow-primary/35 lg:h-[3rem] relative right-0 md:right-7 lg:right-[6.2rem] h-11"
        >
          <div className="flex justify-center items-center gap-1 md:px-3">
            <span className="hidden text-white lg:block">Shorten Now</span>
            <img src={rightArrowIcon} alt="Arrow icon" className="w-3 md:w-4 xl:w-5 lg:mt-1" />
          </div>
        </Button>
      </div>
      
    </form>
  );
};

export default InputUrlBox;
