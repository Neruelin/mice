import Link from 'next/link';
import ButtonWithTextResp from '../components/ButtonWithTextResp.js'

const AppUrl = 'http://localhost:5000';

class Home extends React.Component{
  constructor(props) {
      super(props);
      this.state = this.clearState();
  }

  copyState () {
    let newState = this.clearState();
    newState.Image = this.state.Image;
    newState.VideoName = this.state.VideoName;
    newState.Frame = this.state.Frame;
    newState.X = this.state.X;
    newState.Y = this.state.Y;
    newState.Width = this.state.Width;
    newState.Height = this.state.Height;
    newState.First = this.state.First;
    return newState;
  }

  clearState () {
    return {
      Image: null,
      VideoName: null,
      Frame: null,
      X : null,
      Y : null,
      Width: null,
      Height: null,
      First: true
    }
  }
    
  nextImage() {
    fetch(AppUrl + '/image?f=' + this.state.frame)
      .then(resp => resp.json())
      .then(data => {
        console.log(data);
        let newState = this.clearState();
        newState.Image = data.Image;
        newState.VideoName = data.VideoName;
        newState.Frame = parseInt(data.Frame)
        this.setState(newState);
      }); 
  }

  imageClick(e) {
    let bbox = document.getElementById("frameDiv").getBoundingClientRect();
    let pos = {
      x:  Math.floor(e.clientX - bbox.x),
      y: Math.floor(e.clientY - bbox.y),
    }
    if (this.state.First) {
      let ns = this.copyState();
      ns.X = pos.x;
      ns.Y = pos.y;
      ns.First = false;
      ns.Width = null;
      ns.Height = null;
      this.setState(ns);
    } else {
      let width = Math.abs(pos.x - this.state.X) * 2;
      let height = Math.abs(pos.y - this.state.Y) * 2;
      let ns = this.copyState();
      ns.Width = width;
      ns.Height = height;
      ns.First = true;
      console.log(ns);
      this.setState(ns);
    }
  }

  submitLabel() {
    let bbox = document.getElementById("frameDiv").getBoundingClientRect();
    console.log(this.state.VideoName);
    fetch("http://localhost:5000/submit", {
      method: "POST", 
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        VideoName: this.state.VideoName, 
        Frame: this.state.Frame, 
        X: this.state.X / bbox.width, 
        Y: this.state.Y / bbox.height, 
        Width: this.state.Width / bbox.width, 
        Height: this.state.Height / bbox.height, 
        Found: true
      }),
    });
    this.nextImage();
  }

  skipImage() {
    fetch("http://localhost:5000/submit", {
      method: "POST", 
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        VideoName: this.state.VideoName, 
        Frame: this.state.Frame, 
        X: 0, 
        Y: 0, 
        Width: 0, 
        Height: 0, 
        Found: false
      }),
    });
    this.nextImage();
  }

  clearpos() {
    let ns = this.copyState();
    ns.X = null;
    ns.Y = null;
    ns.Width = null;
    ns.Height = null;
    ns.First = true;
    this.setState(ns);
  }

  render() {
    return(
      <div style={{height: "100%", width: "100%", backgroundColor: "black", color: "white"}}>
        {(this.state.X && this.state.Y && this.state.Width && this.state.Height) ? (
          <div style={{
            width: this.state.Width + "px",
            height: this.state.Height + "px",
            backgroundColor: "rgba(255, 0, 0, 0.25)",
            position: "absolute",
            left: document.getElementById("frameDiv").getBoundingClientRect().x + this.state.X - (this.state.Width / 2),
            top: document.getElementById("frameDiv").getBoundingClientRect().y + this.state.Y - (this.state.Height / 2),
          }}>
          </div>
        ) : (
          <></>
        )}
        <h1>Video: {this.state.VideoName} Frame: {this.state.Frame}</h1>
        <button onClick={() => {this.nextImage()}}>click me</button>
        <div>
          <label>X,Y</label>
          <input style={{width: "50px"}} type="text" value={this.state.X || ""} />
          <input style={{width: "50px"}} type="text" value={this.state.Y || ""} />
          <label>H,W</label>
          <input style={{width: "50px"}} type="text" value={this.state.Width || ""} />
          <input style={{width: "50px"}} type="text" value={this.state.Height || ""} />
          <button onClick={() => {this.clearpos()}}>Clear</button>
          <button onClick={() => {this.skipImage()}}>Skip</button>
          <button onClick={() => {this.submitLabel()}}>Submit</button>
        </div>
        <div id="frameDiv" onClick={(e) => {this.imageClick(e)}}>
          {this.state.Image ? <img src={`data:image/jpeg;base64,${this.state.Image}`} /> : <></>}
        </div>
      </div>
    )
  }
}

export default Home;