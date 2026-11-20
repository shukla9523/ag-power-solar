import NavBar from "./NavBar"

export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 w-full transition-all duration-300"
      style={{ position: "sticky", top: 0, zIndex: 50 }}
    >
      <NavBar />
    </header>
  )
}
