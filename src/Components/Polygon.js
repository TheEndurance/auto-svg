import React, {Component} from 'react';

class Polygon extends Component {
    constructor(props){
        super(props);
        this.state = {
            id: this.props.id,
            points: this.props.points,
            strokeColor: this.props.strokeColor,
            lineWidth: this.props.lineWidth,
            fillColor: this.props.fillColor,
        }
    }
    render(){
        return(
            <polygon />
        )
    }
}