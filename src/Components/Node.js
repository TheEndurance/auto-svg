import React, {Component} from 'react';
import uuid from 'uuid/v1';

class Node extends Component {
    constructor(props){
        super(props);
        this.state = {
            id : this.props.nodeId,
            polygonId : this.props.polygonId,
            x : this.props.x,
            y : this.props.y,
            radius : this.props.radius
        }
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(){
        this.setState((prevState)=>{
            return {radius: prevState.radius};
        });
    }
    render(){
        const {id, x , y , radius} = this.state;
        return (
            <circle key={id} onClick={this.handleClick} cx={x} cy={y} r={radius}>
            </circle>
        )
    }
}

export default Node;