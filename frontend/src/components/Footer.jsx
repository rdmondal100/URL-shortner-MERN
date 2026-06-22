const Footer = () => {
  return (
    <footer className="border-t border-border/60 bg-background/80 px-5 py-5 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 text-sm text-muted-foreground">
        <span>&copy; 2026 URL Shortener. Built for production use.</span>
        <span className="text-xs uppercase tracking-[0.28em]">Fast, secure, analytics-first</span>
      </div>
    </footer>
  )
}

export default Footer