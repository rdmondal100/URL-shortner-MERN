import { TbLoader3 } from "react-icons/tb";

const Loader = () => {
  return (
    <div className=" w-full h-full absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 ">
      <TbLoader3 className=" animate-spin duration-500 ease-linear transition-all"/>
    </div>
  )
} 

export default Loader