import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Point from './Components/Point';


const svg = document.getElementById('svg');
const DrawEnum = {
  "none":1,
  "polygon":2
};
Object.freeze(DrawEnum);


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      tempPolygon: null,
      clickedPoints: [],
      points: [],
      mode: DrawEnum.polygon,
    };
    this.myRef = React.createRef();
    this.mouseMatrixTransformation = this.mouseMatrixTransformation.bind(this);
    this.draw = this.draw.bind(this);
    this.canvasClicked = this.canvasClicked.bind(this);
  }

  mouseMatrixTransformation(x,y){
    let point = this.myRef.current.createSVGPoint();
    point.x = x;
    point.y = y;
    return point.matrixTransform(this.myRef.current.getScreenCTM().inverse());
  }

  draw(event){
    event.preventDefault();
    let clickPoint = this.mouseMatrixTransformation(event.clientX,event.clientY);
    if (this.state.mode === DrawEnum.point){
      let point = <Point x={clickPoint.x} y={clickPoint.y}/>
      this.setState((prevState)=>{
        return { points: [...prevState.points,point]};
      });
    }
  }

  canvasClicked(event){
    event.preventDefault();
    let clickPoint = this.mouseMatrixTransformation(event.clientX,event.clientY);
    this.setState((prevState)=>{
      return { clickedPoints: [...prevState.clickedPoints, {x: clickPoint.x, y:clickPoint.y}]};
    });

    
    const points = arrayPointsToString(this.state.clickedPoints);
    this.setState({
      tempPolygon : (<polygon points={points} style={{fill:"white",stroke:"purple"}}/>)
    });
  }
  render() {
    const { points, tempPolygon } = this.state;
    return (
      <svg ref={this.myRef} onClick={this.canvasClicked} id="svg"  version="1.1" baseProfile="full" width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
        {tempPolygon}
      </svg>
    );
  }
}

export default App;

function arrayPointsToString(clickedPoints) {
  return clickedPoints.reduce((accumulator, current) => {
    return accumulator += `${current.x},${current.y} `;
  },"");
}

