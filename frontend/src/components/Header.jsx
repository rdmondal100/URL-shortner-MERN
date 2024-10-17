import { loginIcon } from '../assets'
import {Button} from '../components/ui/button'


const Header = () => {
  return (
    <header className=' flex w-[100vw] justify-between  py-4 relative md:px-5 px-2'>
      <a className="logo flex justify-start items-center gap-1 " href='' >
        <img src="/favicon-512x512.png" alt="" className=' w-14' />
        <span className='gradient-logo font-extrabold text-2xl md:text-3xl'>URL Shortner</span>
      </a>
      <div className="auth flex gap-4 pr-5 md:pr-4 xl:pr-7">
        <Button className=" bg-muted text-foreground rounded-full md:py-6 md:px-5 ">
          <div className=" flex gap-1 md:gap-2 py-3">
          <span>Login</span> 
          <img src={loginIcon} alt="" />

          </div>
        </Button>
        <Button className=" bg-primary text-foreground rounded-full md:flex gap-1 shadow-md shadow-primary/30 hidden md:py-6 md:px-5">
          <span>Register Now</span>
        </Button>
        
      </div>
    </header>
  )
}

export default Header