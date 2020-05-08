
class ButtonWithTextResp extends React.Component {
  constructor (props) {
    super(props);
  }
  
  render() {
    return (
      <div>
        <div>
          <input type="button" value="Get from server" />
        </div>
        <div>
          {""}
        </div>
      </div>
    )
  }
}

export default ButtonWithTextResp;