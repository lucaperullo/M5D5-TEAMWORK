import React, { Component } from "react";
import Navbar from "./Navbar";

class Home extends Component {
  state = {
    products: [],
  };

  fetchProducts = async () => {
    try {
      let response = await fetch(`http://127.0.0.1:3004/products`);
      let data = await response.json();
      this.setState({ products: data });
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  componentDidMount = () => {
    this.fetchProducts();
  };

  render() {
    console.log(this.props);
    return (
      <div>
        <Navbar />
        {this.state.products.map((product) => (
          <span>{product.name}</span>
        ))}
      </div>
    );
  }
}

export default Home;
