import React from 'react';
import Cell from './Cell.js';

class Canvas extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            cells: [],
            incrementor: null,
            step: 0
        }
        this.handleCellClick = this.handleCellClick.bind(this);
        this.handleNextClick = this.handleNextClick.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleStartTime = this.handleStartTime.bind(this);
        this.handleStopTime = this.handleStopTime.bind(this);
    }

    componentDidMount(){
        let masterArray = this.newEmptyCellArray();
        if(this.state.incrementor){
            this.handleStopTime();
        }
        this.setState({cells: masterArray});
    }

    handleCellClick(data) {
        let cell = this.state.cells[data.row][data.col];
        if (cell.status === 'dead'){
            this.setState(
                prevState => {
                    const cells = [...prevState.cells];
                    let newCell = React.cloneElement(cells[data.row][data.col].cell, {status: 'alive'});
                    cells[data.row][data.col] = {cell:newCell, status: 'alive'};
                    return {cells};
                }
            )
        }
        else{
            this.setState(
                prevState => {
                    const cells = [...prevState.cells];
                    let newCell = React.cloneElement(cells[data.row][data.col].cell, {status: 'dead'});
                    cells[data.row][data.col] = {cell:newCell, status: 'dead'};
                    return {cells};
                }
            )
        }

    }

    handleReset(){
        let masterArray = this.newEmptyCellArray();
        if(this.state.incrementor){
            this.handleStopTime();
        }
        this.setState({cells: masterArray, step: 0});
    }

    newEmptyCellArray(){
        let masterArray = [];
        let row = [];
        let width = this.props.width;
        let height = this.props.height;

        for (let i = 0; i < height; i++){
            for (let j = 0; j < width; j++){
                row.push({
                    cell:<Cell
                        status={'dead'}
                        key={'row: ' + i + ' col: ' + j}
                        col={j}
                        row={i}
                        handleCellClick={this.handleCellClick}
                    />,
                    status:'dead'
                    })
                }
            masterArray.push(row);
            row = [];
        }
        return masterArray;
    }

    handleNextClick(){
        this.cellLifeCheck();
        this.forceUpdate();
    }

    handleStartTime(){
        if(!this.state.incrementor){
            var incrementor = setInterval(
                () =>{this.cellLifeCheck();},
                150
            );
            this.setState({
                incrementor: incrementor
            })
        }
    }

    handleStopTime(){
        clearInterval(this.state.incrementor);
        this.setState({incrementor: null});
    }

    cellLifeCheck(){
        let width = this.props.width;
        let height = this.props.height;
        let newArray = this.state.cells;
        let emptyArray = this.newEmptyCellArray();
        for (let i = 0; i < height; i++){
            for (let j = 0; j < width; j++){
                let checkCells = this.checkAdjacentCells(i, j, newArray[i][j].status);
                if (checkCells){
                    emptyArray[i][j].cell = React.cloneElement(newArray[i][j].cell, {status: 'alive'})
                    emptyArray[i][j].status = 'alive';
                }
                else if (!checkCells){
                    emptyArray[i][j].cell = React.cloneElement(newArray[i][j].cell, {status: 'dead'})
                    emptyArray[i][j].status = 'dead';
                }
            }
        }
        this.setState({cells: emptyArray, step: this.state.step + 1});
    }

    /*
    TRUE == alive
    FALSE == dead
    1. fewer than two alive cells die
    2. more than three alive cells die
    3. dead cells with three or more neighbours come alive
    4. if three cells are alive, do nothing I guess :)
    */
    checkAdjacentCells(row, col, status){
        let width = this.props.width;
        let height = this.props.height;
        let heightArr = [];
        let count = 0;
        for (let i = row - 1; i <= row + 1; i++){
            for (let k = col- 1; k <= col + 1; k++){
                if(i < 0 || i >= height || k < 0 || k >= width){
                    continue;
                }
                else if (i === row && k === col){
                    continue;
                }
                else{
                    if (this.state.cells[i][k].status === 'alive'){
                        count++;
                    }
                }
            }
            heightArr.push(count);
            count = 0;
        }
        count = heightArr.reduce((a, b) => a + b, 0);
        //final check
        if (count < 2 && status === 'alive'){
            return false;
        }
        else if (count > 3 && status === 'alive'){
            return false;
        }
        else if (count === 3 && status === 'dead'){
            return true;
        }
        else if ((count === 2 || count === 3) && status === 'alive'){
            return true;
        }
        return false;
    }

    render(){
        let cells = this.state.cells;
        return(
            <div>
                {cells.map((value,index) => {
                    return(
                        <div className='row' key={index}>
                            {value.map((cell, index) =>{
                                return <React.Fragment>{cell.cell}</React.Fragment>;
                            })}
                        </div>
                    )
                })}
                <div className='controls'>
                    <button onClick={this.handleNextClick}>Next</button>
                    <button onClick={this.handleStartTime}>Start</button>
                    <button onClick={this.handleStopTime}>Stop</button>
                    <button onClick={this.handleReset}>Reset</button>
                    <p className='steps'>N = {this.state.step}</p>
                </div>
            </div>
        )
    }
}

export default Canvas;