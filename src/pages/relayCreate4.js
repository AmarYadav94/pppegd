import React, { Component } from 'react';
import { scatterLogin, transfer, createRelay, createSmart, buyToken, sellToken, convertToken } from "../utils/methods";
import '../style/Create.css';
import Eos from "eosjs";
var scatter={};
export default class Create4 extends Component {
    constructor(props){
        super(props);
                this.state={
                     token1Address     : this.props.location.state.token1Address,
                     token2Address     : this.props.location.state.token2Address,
                     tokenSymbol       :this.props.location.state.tokenSymbol,
                     numberOfToken     :this.props.location.state.numberOfToken,
                     connector1Symbol  :this.props.location.state.connector1Symbol,
                     connector1Deposit :this.props.location.state.connector1Deposit,
                     connector2Symbol  :this.props.location.state.connector2Symbol,
                     pegDeposit        :this.props.location.state.pegDeposit,
                    ButtonState : false,
                };
                this.stateEos={
                    from:'',
                     to:"intermediate",
                     permission:""};
                console.log(this.props.location.state.token1Address);
                console.log(this.props.location.state.token2Address);
                console.log(this.props.location.state.tokenSymbol);
                console.log(this.props.location.state.numberOfToken);
                console.log(this.props.location.state.connector1Symbol);
                console.log(this.props.location.state.connector1Deposit);
                console.log(this.props.location.state.pegDeposit);
        }

        handleTransfer = ()=> {
            let eosOptions = {
            chainId: "038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca"
          };
         let network = {
            protocol: "http", // Defaults to https
            blockchain: "eos",
            host: "193.93.219.219",
            port: 8888,
            chainId: "038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca"
          };
        console.log("transfer initiated");
        let scatter = window.scatter;
        console.log("scatter",scatter.identity.accounts[0].name);
        let eos= scatter.eos(network, Eos, eosOptions);
        this.stateEos.from = scatter.identity.accounts[0].name;
        this.stateEos.permission = scatter.identity.accounts[0].authority;
        console.log("state----",this.stateEos);
        console.log("check",this.props.location.state.token2Address);
        eos.transaction(
          {
            actions: [
              {
                account: this.props.location.state.token2Address,
                name: 'transfer',
                authorization: [{
                  actor: this.stateEos.from,
                  //permission: this.state.permission
                  permission: this.stateEos.permission
                }],
                data: {
                  from: this.stateEos.from,
                  to: this.stateEos.to,
                  quantity: `${this.state.pegDeposit} ${this.props.location.state.connector2Symbol}`,
                  memo: "hello"
                  //memo: parseInt(this.compareData[0].gameresult)+ parseInt(this.logIn.controls['pegDiposit'].value)
                }
              }
            ]
          }).catch(error => {
            this.setState({
                ButtonState: false
            })
            console.log("error---", error)
            if (error.type == undefined) {
                const parsedResponse = JSON.parse(error);
                alert(parsedResponse.error.details[0].message);
            }
            else {
                console.log(error.message);
            }
        });

    }
    

    createToken(){
        var  total_supply = this.props.location.state.numberOfToken+" "+this.props.location.state.tokenSymbol;
        var  connector1 = this.props.location.state.connector1Deposit+" "+this.props.location.state.connector1Symbol;
        var address1 = this.props.location.state.token1Address;
        var address2 = this.props.location.state.token2Address;
        var  connector2 = this.props.location.state.pegDeposit+" "+this.props.location.state.connector2Symbol;
        var tokenSym = this.props.location.state.tokenSymbol;
      createRelay(total_supply,connector1,address1,connector2,address2,tokenSym);   
     }

    render() {
        return (
            <div>
                <div className="row createToken pad">
                    <div className="container c5 nopad">
                        <div className="ui-lg-6 npl">
                            <div className="ui-lg-12 sh w b2 br2 tokenadd nopad">
                                <p className="c5x mg0 pad f3 f16 c3">List a New Token on PEGDEX</p>
                                <div className="pad">
                                    <h5 className="f2 mg0 c3 mgtb">Deposit PEG:USD pegDeposit</h5>
                                    <h1>${this.props.location.state.pegDeposit}</h1>
                                    {/* <button className="c7 br2" onClick={this.handleTransfer}>Transfer</button> */}
                                    <button onClick={()=>{this.handleTransfer()}} className="c7 br2">Transfer</button>
                                </div>
                                <div className="full pad tr bn5x">
                                <button disabled={!this.state.ButtonState} className="c7 br2" onClick = {() => this.createToken()}>CREATE</button>
                                </div>
                            </div>
                        </div>
                        <div className="ui-lg-6 npr">
                            <div className="ui-lg-12 sh w br2 nopad">
                                <p className="f15 pad c3">Listing a token on PegDex is easy. You can use this form to generate a new relay between your token and the PEG:USD stabletoken. Once you have created a relay it will automatically be listed on PegDex. You will receive the entire initial supply of relay tokens, and they can be sold at any time to pull out your deposit amounts. By owning relay token(s) you will also earn fees whenever people buy or sell through the relay on PegDex. All new listings must be funded with a minimum of 20,000 PEG:USD Tokens.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
