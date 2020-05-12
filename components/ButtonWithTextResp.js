class ButtonWithTextResp extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      option: true,
    }

    this.stateoptions = {
      choice1: "I am GROOT",
      choice2: "I AM POOP"
    }
  }

  ChangeState = (e) => {
    this.setState({option: !this.state.option})
  }

  DisplayStateOptions = () => {
    if (this.state.option){
      return this.stateoptions.choice1
    }else{
      return this.stateoptions.choice2
    }
  }
  
  render() {
    return (
      <div>
        <div id="Test">
          <input type="button" value="Get from server"/>
        </div>
        <div id="Test">
          <input type="button" value="ChangeState" onClick={this.ChangeState}/>
        </div>
        <div>
          {this.DisplayStateOptions()}
        </div>
      </div>
    )
  }
}

export default ButtonWithTextResp;