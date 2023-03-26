import React from "react";
import Card from "react-credit-cards";
import { fetchWrapper } from '_helpers';
import "react-credit-cards/es/styles-compiled.css";
import { toast } from "react-toastify";
import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate,
  formatFormData
} from "./utils";


export { AddCard };

class AddCard extends React.Component {
  
  state = {
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    issuer: "",
    focused: "",
    loading: false,
    formData: null
  };

  handleCallback = ({ issuer }, isValid) => {
    if (isValid) {
      this.setState({ issuer });
    }
  };

  handleInputFocus = ({ target }) => {
    this.setState({
      focused: target.name
    });
  };

  handleInputChange = ({ target }) => {
    if (target.name === "number") {
      target.value = formatCreditCardNumber(target.value);
    } else if (target.name === "expiry") {
      target.value = formatExpirationDate(target.value);
    } else if (target.name === "cvc") {
      target.value = formatCVC(target.value);
    }

    this.setState({ [target.name]: target.value });
  };

  handleSubmit = async(e) => {
    e.preventDefault();
    const { issuer } = this.state;
    const formData = [...e.target.elements]
      .filter(d => d.name)
      .reduce((acc, d) => {
        acc[d.name] = d.value;
        return acc;
      }, {});
    
    const bodyParams = {
        "name": formData.tittle,
        "cardExpiration": formData.expiry,
        "cardHolder": formData.name,
        "cardNumber": formData.number,
        "category": issuer.toUpperCase() === 'MASTERCARD' ? 'MC' : issuer.toUpperCase() === 'AMEX' ? 'AE' : 'VISA'
    }
    
    try {
        this.setState({ loading: true });
        const baseUrl = `${process.env.REACT_APP_API_URL}`;
        const data = await fetchWrapper.post(`${baseUrl}/cards`,bodyParams)
        toast.success("Card added successfully")
        this.setState({ loading: false });
        this.form.reset();
    } catch (e) {
        console.log(e);
        this.setState({ loading: false });
        toast.error("Unable to save the card")
    }    
  };

  render() {
    const { name, number, expiry, cvc, focused, issuer, formData, loading } = this.state;

    return (
      <div key="Payment">
        <div className="card">   
        <h4 className="card-header">Add New Card</h4>             
        <div className="card-body">
            <div className="App-payment">            
            <Card
                number={number}
                name={name}
                expiry={expiry}
                cvc={cvc}
                focused={focused}
                callback={this.handleCallback}
            />
            <form ref={c => (this.form = c)} onSubmit={this.handleSubmit}>                
                <div className="form-group">
                <input
                    type="tel"
                    name="number"
                    className="form-control"
                    placeholder="Card Number"
                    pattern="[\d| ]{16,22}"
                    required
                    onChange={this.handleInputChange}
                    onFocus={this.handleInputFocus}
                />
                <small>E.g.: 49..., 51..., 36..., 37...</small>
                </div>
                <div className="form-group">
                <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Card Holder Name"
                    required
                    onChange={this.handleInputChange}
                    onFocus={this.handleInputFocus}
                />
                </div>
                <div className="row">
                <div className="col-6">
                    <input
                    type="tel"
                    name="expiry"
                    className="form-control"
                    placeholder="Valid Thru"
                    pattern="\d\d/\d\d"
                    required
                    onChange={this.handleInputChange}
                    onFocus={this.handleInputFocus}
                    />
                </div>
                <div className="col-6">
                    <input
                    type="tel"
                    name="cvc"
                    className="form-control"
                    placeholder="CVC"
                    pattern="\d{3,4}"
                    required
                    onChange={this.handleInputChange}
                    onFocus={this.handleInputFocus}
                    />
                </div>
                </div>
                <div className="mt-4 form-group">
                <input
                    type="text"
                    name="tittle"
                    className="form-control"
                    placeholder="Card Custom Name"                    
                    required                    
                />                
                </div>
                <input type="hidden" name="issuer" value={issuer} />
                <div className="form-actions">
                <button className="btn btn-primary btn-block">{loading? <span className="spinner-border spinner-border-sm"></span> : "Save"}</button>
                </div>
            </form>     
            </div>
        </div>           
        </div> 
      </div>
    );
  }
}
