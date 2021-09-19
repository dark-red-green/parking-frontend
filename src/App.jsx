import "./App.css"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Home from "./pages/Home"

function App() {
  return (
    <div className="App" style={{ height: "100%", width: "100%" }}>
      <Router>
        <Switch>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App
