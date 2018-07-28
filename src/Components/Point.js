import React, {Component} from 'react';
class Point extends Component {
    constructor(props){
        super(props);
        this.state = {
            x : this.props.x,
            y : this.props.y,
            radius : 5
        }
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(){
        this.setState((prevState)=>{
            return {radius: prevState.radius + 20};
        });
    }
    render(){
        const {x , y , radius} = this.state;
        return (
            <circle onClick={this.handleClick} cx={x} cy={y} r={radius}>
            </circle>
        )
    }
}

export default Point;