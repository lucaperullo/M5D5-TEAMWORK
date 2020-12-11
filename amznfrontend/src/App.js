import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Home from "./components/Home";
import Product from "./components/Product";
import Cart from "./components/Cart";
import Backoffice from "./components/Backoffice";
import { BrowserRouter as Router, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Route path="/" exact render={(props) => <Home {...props} />} />
      <Route path="/cart" render={(props) => <Cart {...props} />} />
      <Route path="/backoffice" render={(props) => <Backoffice {...props} />} />
      <Route
        path="/product/:productId"
        render={(props) => <Product {...props} />}
      />
    </Router>
  );
}

export default App;
