import NavBar from "./NavBar"

export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-neutral-200/80 bg-white/95 backdrop-blur-md transition-all duration-300"
      style={{ position: "sticky", top: 0, zIndex: 50 }}
    >
      <NavBar />
    </header>
  )
}
