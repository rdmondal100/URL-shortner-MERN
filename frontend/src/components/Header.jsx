import { Link, NavLink } from "react-router-dom"
import { ChevronDown, LayoutDashboard, Link2, LogOut } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { ToggleTheme } from "./ToggleTheme"
import { logout } from "../store/authSlice"

const getInitials = (value = "") => {
  const words = value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)

  if (!words.length && value.includes("@")) {
    return value.slice(0, 2).toUpperCase()
  }

  return words.map((word) => word[0]).join("").toUpperCase().slice(0, 2) || "U"
}

const Header = () => {
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.authData)
  const profileName = user?.name || user?.email?.split("@")[0] || "Account"
  const profileEmail = user?.email || "Secure access"
  const profileInitials = getInitials(user?.name || user?.email || "User")

  return (
    <header className='sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-2xl'>
      <div className='mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8'>
        <Link className="logo flex min-w-0 items-center gap-3" to={isAuthenticated ? "/dashboard" : "/"}>
          <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm shadow-primary/20 ring-1 ring-primary/20'>
            <img src="/favicon-512x512.png" alt="" className='h-8 w-8' />
          </div>
          <div className="min-w-0 leading-tight">
            <span className='gradient-logo block truncate text-lg font-semibold tracking-tight md:text-xl'>URL Shortener</span>
            <span className='hidden text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:block'>Link management</span>
          </div>
        </Link>

        {isAuthenticated ? (
          <nav className='flex items-center gap-1 rounded-md border border-border/80 bg-muted/35 p-1 shadow-sm'>
            <NavItem to="/dashboard" icon={LayoutDashboard}>Dashboard</NavItem>
            <NavItem to="/create-link" icon={Link2}>Create</NavItem>
          </nav>
        ) : null}

        <div className="auth flex items-center gap-2 sm:gap-3">
          <ToggleTheme />
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className='flex h-11 items-center gap-2 rounded-md border border-border/80 bg-card/90 px-2 text-left shadow-sm transition hover:border-primary/35 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:gap-3 sm:px-3'>
                  <span className='flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary sm:h-9 sm:w-9 sm:text-sm'>
                    {profileInitials}
                  </span>
                  <span className='hidden min-w-0 flex-col leading-tight md:flex'>
                    <span className='max-w-36 truncate text-sm font-medium'>{profileName}</span>
                    <span className='truncate text-xs text-muted-foreground'>{profileEmail}</span>
                  </span>
                  <ChevronDown className='h-4 w-4 text-muted-foreground' />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-72 rounded-md p-2'>
                <DropdownMenuLabel className='space-y-1 rounded-md bg-muted/50 p-3'>
                  <p className='text-xs uppercase tracking-[0.22em] text-muted-foreground'>Signed in as</p>
                  <p className='text-sm font-semibold'>{profileName}</p>
                  <p className='truncate text-xs text-muted-foreground'>{profileEmail}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='text-destructive focus:text-destructive' onSelect={() => dispatch(logout())}>
                  <LogOut className='mr-2 h-4 w-4' />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>
    </header>
  )
}

const NavItem = ({ children, icon: Icon, to }) => (
  <NavLink
    className={({ isActive }) =>
      `inline-flex h-9 items-center justify-center rounded-md px-2.5 text-sm font-medium transition sm:px-3 ${
        isActive
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:bg-background/70 hover:text-foreground"
      }`
    }
    to={to}
  >
    <Icon className='h-4 w-4 sm:mr-2' />
    <span className='hidden sm:inline'>{children}</span>
  </NavLink>
)

export default Header
