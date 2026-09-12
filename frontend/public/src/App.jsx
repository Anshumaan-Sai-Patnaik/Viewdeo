import './App.css'

import Hero from './Hero/!main'
import NavBar from './NavBar/!main'

function App() {
  return (
    <div className="app-shell">
      <NavBar />
      <main className="app-main">
        <Hero />
      </main>
    </div>
  )
}

export default App
