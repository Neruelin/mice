import Link from 'next/link';
import ButtonWithTextResp from '../components/ButtonWithTextResp.js'

class Home extends React.Component{
  constructor(props) {
      super(props)
  }
    
  render() {
    return(
      <div>
        <h1>Man not hot</h1>
        <Link href="/">
          <a>Home</a>
        </Link>
        <ButtonWithTextResp text="teehee"/>
      </div>
    )
  }
}

export default Home;