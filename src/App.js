import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Point from './Components/Point';


const svg = document.getElementById('svg');
const DrawEnum = {
  "point":1
};
Object.freeze(DrawEnum);


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      points: [],
      mode: DrawEnum.point,
    };
    this.myRef = React.createRef();
    this.mouseMatrixTransformation = this.mouseMatrixTransformation.bind(this);
    this.draw = this.draw.bind(this);
  }

  mouseMatrixTransformation(event){
    let point = this.myRef.current.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    return point.matrixTransform(this.myRef.current.getScreenCTM().inverse());
  }

  draw(event){
    event.preventDefault();
    let clickPoint = this.mouseMatrixTransformation(event);
    if (this.state.mode === DrawEnum.point){
      let point = <Point x={clickPoint.x} y={clickPoint.y}/>
      this.setState((prevState)=>{
        return { points: [...prevState.points,point]};
      });
    }
  }
  render() {
    const { points } = this.state;
    return (
      <svg ref={this.myRef} onClick={this.draw} id="svg"  version="1.1" baseProfile="full" width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
      {points}
      </svg>
    );
  }
}

export default App;
