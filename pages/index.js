import Link from 'next/link';
import ButtonWithTextResp from '../components/ButtonWithTextResp.js'

class Home extends React.Component{
  constructor(props) {
      super(props);
      this.state = {img: null, frame: 0, pos1 : {}, pos2 : {}, first: true};
  }
    
  nextImage() {
    fetch("http://localhost:5000/image?f=" + this.state.frame)
      .then(resp => resp.json())
      .then(data => {
        console.log(data)
        this.setState({
          img: data.image,
          videoName: data.videoName,
          frame: parseInt(data.frame),
          pos1: {},
          pos2: {},
          first: true,
        });
      }); 
  }

  imageClick(e) {
    let bbox = document.getElementById("frameDiv").getBoundingClientRect();
    let pos = {
      x:  Math.floor(e.clientX - bbox.x),
      y: Math.floor(e.clientY - bbox.y),
    }
    if (this.state.first) {
      this.setState({
        img: this.state.img,
        frame: this.state.frame,
        pos1: pos,
        pos2: this.state.pos2,
        first: false
      });
    } else {
      this.setState({
        img: this.state.img,
        frame: this.state.frame,
        pos1: this.state.pos1,
        pos2: pos,
        first: true
      });
    }
  }

  submitLabel() {
    fetch("http://localhost:5000/submit", {
      method: "POST", 
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({pos1: this.state.pos1, pos2: this.state.pos2, found: true}),
    });
  }

  clearpos() {
    this.setState({
      img: this.state.img,
      frame: this.state.frame,
      pos1: {},
      pos2: {},
      first: false
    });
  }

  render() {
    return(
      <div>
        {(this.state.pos1.x && this.state.pos1.y && this.state.pos2.x && this.state.pos2.y) ? (
          <div style={{
            width: Math.abs(this.state.pos2.x - this.state.pos1.x) + "px",
            height: Math.abs(this.state.pos2.y - this.state.pos1.y) + "px",
            backgroundColor: "rgba(255, 0, 0, 0.25)",
            position: "absolute",
            left: document.getElementById("frameDiv").getBoundingClientRect().x + Math.min(this.state.pos1.x, this.state.pos2.x),
            top: document.getElementById("frameDiv").getBoundingClientRect().y + Math.min(this.state.pos1.y, this.state.pos2.y),
          }}>
          </div>
        ) : (
          <></>
        )}
        <h1>Frame: {this.state.frame}</h1>
        <button onClick={() => {this.nextImage()}}>click me</button>
        <div>
          <label>pos1</label>
          <input style={{width: "50px"}} type="text" value={this.state.pos1.x || ""} />
          <input style={{width: "50px"}} type="text" value={this.state.pos1.y || ""} />
          <label>pos2</label>
          <input style={{width: "50px"}} type="text" value={this.state.pos2.x || ""} />
          <input style={{width: "50px"}} type="text" value={this.state.pos2.y || ""} />
          <button onClick={() => {this.clearpos()}}>Clear</button>
          <button onClick={() => {this.nextImage()}}>Skip</button>
          <button onClick={() => {this.submitLabel()}}>Submit</button>
        </div>
        <div id="frameDiv" onClick={(e) => {this.imageClick(e)}}>
          <img src={`data:image/jpeg;base64,${this.state.img}`} />
        </div>
      </div>
    )
  }
}

export default Home;