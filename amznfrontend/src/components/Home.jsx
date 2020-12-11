import React, { Component } from "react";
import { Card, Col, Container, Row, Button } from "react-bootstrap";

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
      <>
        <Container>
          <Row>
            {this.state.products.map((product) => (
              <Card style={{ width: "18rem" }}>
                <Card.Img
                  variant="top"
                  src={product.imageUrl}
                  style={{ height: "120px", width: "150px" }}
                />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>{product.price}€</Card.Text>
                  <Button variant="primary">Go somewhere</Button>
                </Card.Body>
              </Card>
            ))}
          </Row>
        </Container>
      </>
    );
  }
}

export default Home;
