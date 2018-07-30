import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Node from './Components/Node';
import uuid from 'uuid/v1';


const svg = document.getElementById('svg');
const DrawEnum = {
  "none":1,
  "polygon":2
};
Object.freeze(DrawEnum);

function convertRadiansToDegrees(rad){
  return rad * 180 / Math.PI;
}

class Vector2 {
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.getLength = this.getLength.bind(this);
    this.calculateDotProduct = this.calculateDotProduct.bind(this);
    this.calculateAngleBetweenVector = this.calculateAngleBetweenVector.bind(this);
    this.scale = this.scale.bind(this);
  }
  getLength(){
    return Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2))
  }
  calculateDotProduct(vector){
    return (this.x * vector.x) + (this.y * vector.y);
  }
  calculateAngleBetweenVector(vector){
    return Math.acos(this.calculateDotProduct(vector) / (this.getLength() * vector.getLength()));
  }
  scale(factor){
    return new Vector2(this.x*factor,this.y*factor);
  }
}

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      tempAngle: null,
      tempLine: null,
      tempPolygon: null,
      nodes: [],
      clickedPoints: [],
      mode: DrawEnum.polygon,
    };
    this.myRef = React.createRef();
    this.mouseMatrixTransformation = this.mouseMatrixTransformation.bind(this);
    this.drawNode = this.drawNode.bind(this);
    this.canvasClicked = this.canvasClicked.bind(this);
    this.mouseOver = this.mouseOver.bind(this);
  }
  

  mouseMatrixTransformation(x,y){
    let point = this.myRef.current.createSVGPoint();
    point.x = x;
    point.y = y;
    return point.matrixTransform(this.myRef.current.getScreenCTM().inverse());
  }

  drawNode(clickPoint){
    let node = <Node nodeId={uuid()} x={clickPoint.x} y={clickPoint.y} radius="3"/>
    this.setState((prevState)=>{
      return { nodes: [...prevState.nodes,node]};
    });
  }

  mouseOver(event){
    if (this.state.clickedPoints.length > 0){
      //draw a line to where mouse is from previous point
      let currentPoint = this.mouseMatrixTransformation(event.clientX,event.clientY);
      const prevPoint = this.state.clickedPoints[this.state.clickedPoints.length-1];

      this.setState({
        tempLine: <line x1={prevPoint.x} y1={prevPoint.y} x2={currentPoint.x} y2={currentPoint.y} strokeDasharray="5,5" stroke="black"/>
      });

      //if we have alteast two points
      if (this.state.clickedPoints.length >=2){
        const pointA = this.state.clickedPoints[this.state.clickedPoints.length-2];
        const pointB = this.state.clickedPoints[this.state.clickedPoints.length-1];    
        const pointC = currentPoint;    

        const vectorAB = new Vector2(pointB.x - pointA.x, pointB.y-pointA.y);
        const vectorBA = new Vector2(pointA.x - pointB.x, pointA.y - pointB.y);
        const vectorBC = new Vector2(pointC.x - pointB.x, pointC.y - pointB.y);

        //calculate which side the angle should be shown
        const x = 1;
        const y = (-vectorAB.x/vectorAB.y);
        const perpendicularVector = new Vector2(x,y);
        const angleBetweenNormalAndTemp = convertRadiansToDegrees(perpendicularVector.calculateAngleBetweenVector(vectorBC));
        let xOffset = 0;
        let yOffset = 0;
        console.log(vectorBC.calculateDotProduct(vectorAB));
        if (angleBetweenNormalAndTemp <= 90 && pointC.y >= pointB.y){
          xOffset = 5;
          yOffset = 15;
        }
        else if (angleBetweenNormalAndTemp < 90 && pointC.y < pointB.y){
          xOffset = 5;
          yOffset = -15
        } 
        else if (angleBetweenNormalAndTemp >= 90 && pointC.y >= pointB.y) {
          xOffset = -40;
          yOffset = 15;
        } 
        else if (angleBetweenNormalAndTemp > 90 && pointC.y < pointB.y){
          xOffset = -40;
          yOffset = -15;
        }
        //calculate angle between vectors
        const theta = convertRadiansToDegrees(vectorBA.calculateAngleBetweenVector(vectorBC));
        //draw text angle
        this.setState({
          tempAngle: <text x={pointB.x+xOffset} y={pointB.y+yOffset}>{theta.toFixed(1)}	&deg;</text>
        });
      }
    }
  }

  canvasClicked(event){
    event.preventDefault();
    if (this.state.mode === DrawEnum.polygon){
      //left click
      if (event.button === 0){
        //store clickedPoints
        if (this.state.tempLine!==null){
          this.setState({
            tempLine:null
          });
        }
        let clickPoint = this.mouseMatrixTransformation(event.clientX,event.clientY);
        //draw nodes
        this.drawNode(clickPoint);

        this.setState((prevState)=>{
          return { clickedPoints: [...prevState.clickedPoints, {x: clickPoint.x, y:clickPoint.y}]};
        }, () => {
          //gets point, draws polygon
          const points = arrayPointsToString(this.state.clickedPoints);
          this.setState({
            tempPolygon : <polygon points={points} style={{fill:"white",stroke:"purple",fillOpacity:"0.5"}}/>
          })
        });


      } else if (event.button === 2 ){ //right click  
      }
    }
  }

  render() {
    const { nodes, tempPolygon, tempLine, tempAngle } = this.state;
    return (
      <svg ref={this.myRef} onClick={this.canvasClicked} onMouseMove={this.mouseOver} id="svg"  version="1.1" baseProfile="full" width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
        {nodes}
        {tempPolygon}
        {tempLine}
        {tempAngle}
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

