
import { ToggleTheme } from "../../components/ToggleTheme";
import InputUrlBox from "../../components/InputUrlBox";
import ShowDetails from "../../components/ShowDetails";
import HistoryOfAllUrls from "../../components/HistoryOfAllUrls";

const Home = () => {

    
	return (
		<section className='home min-h-[80vh] bg-no-repeat w-full flex flex-col justify-center  px-5 ' 
  
    >
			<div  className=' theme toggle hidden md:block absolute  top-[55%] -right-24'>
				<ToggleTheme />
			</div>


      {/* <div className='registerBottom fixed bottom-0 gradient-bottomRegister w-full h-16 backdrop-blur-sm flex justify-center items-center '
			>
				<p className='text-center flex gap-1 w-full justify-center items-center text-sm text-muted-foreground'>
					<span className='text-primary'>Register New </span> to enjoy
					Unlimited History
				</p>
			</div> */}

			<div className='inputDetails w-full flex justify-center items-center flex-col '>
				<div className='details mt-14 flex flex-col gap-6 '>
					<h1 className='title gradient-title text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-center font-extrabold'>
						Shorten Your Loooong Links :)
					</h1>
					<p className=' text-center text-sm text-muted-foreground md:text-[1rem] xl:text-lg'>
						URL Shortner is an efficient and easy-to-use URL shortening
						service that streamlines your online experience.
					</p>
				</div>

				<div className=' inputBoxContainer   w-[90vw] flex justify-center items-center top-10 h-32 relative'>
          <InputUrlBox/>
        </div>
			</div>

      <div className=" w-full flex justify-center items-center h-20 mt-8">
        <ShowDetails/>
      </div>

      <div className="allHistoryUrls w-full mt-40">
        <HistoryOfAllUrls/>
      </div>

		</section>
	);
};

export default Home;
