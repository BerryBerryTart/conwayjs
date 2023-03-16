import React from 'react';

class Cell extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            className: 'square',
            status: this.props.status
        };
        this.handleInternalClick = this.handleInternalClick.bind(this);
    }

    handleInternalClick(){
        this.setAliveOrDeadStatus();
        this.handleExternalClick();
    }

    handleExternalClick(){
        this.props.handleCellClick(
            {
                row: this.props.row,
                col: this.props.col
            }
        )
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            status: nextProps.status,
            className: 'square ' + nextProps.status
        };
    }

    setAliveOrDeadStatus() {
        if (this.state.status === 'dead'){
            this.setState({
                className: 'square alive',
                status: 'alive'
            });
        }
        else {
            this.setState({
                className: 'square dead',
                status: 'dead'
            });
        }
    }

    render () {
        return(
            <div
                className={this.state.className}
                onClick={this.handleInternalClick}
            ></div>
        );
    }
}

export default Cell;