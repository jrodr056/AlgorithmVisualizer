import React, {Component} from 'react'
class NavBar extends Component {
    render(){
        const {onRun,onReset} = this.props;
        return (
            <nav className="navbar navbar-expand-sm navbar-light bg-dark">
                    <button onClick={onReset} className="btn btn-light btn-sm mr-5">Reset Array</button>
                    <p className="mr-2 text-light">Sorting Algorithm:</p>
                    <select id="algorithm" className="mr-2">
                        <option value="bubble">Bubble</option>
                        <option value="insertion">Insertion</option>
                        <option value="selection">Selection</option>
                        <option value="merge">Merge</option>
                    </select>
                    <button onClick={onRun} className="btn btn-light btn-sm">Run</button>
            </nav>
        );
    }
}
 
export default NavBar;