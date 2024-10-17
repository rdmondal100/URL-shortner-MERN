import { loginIcon } from '../assets'
import {Button} from '../components/ui/button'
const Header = () => {
  return (
    <header className=' flex w-[100vw] justify-between  py-8 h-28 relative px-5'>
      <a className="logo " href='#'>
        <span className='gradient-logo font-extrabold text-2xl md:text-3xl md:pl-5'>URL Shortner</span>
      </a>
      <div className="auth flex gap-4 pr-3 md:pr-4 xl:pr-7">
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