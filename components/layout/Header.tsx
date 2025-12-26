import TopBar from './TopBar'
import MainHeader from './MainHeader'
import NavigationBarClient from './NavigationBarClient'

export default function Header() {
  return (
    <header className="sticky top-0 z-50">
      <TopBar />
      <MainHeader />
      <NavigationBarClient />
    </header>
  )
}
