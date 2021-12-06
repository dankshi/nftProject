import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from './components/contents/Home'
import MintStake from './components/contents/MintStake'
function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/mint-stake" component={MintStake}/>
      </Switch>
    </Router>
  )
}

export default App;