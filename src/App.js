import React,{Component} from "react";
import NavBar from './components/navbar';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

class App extends Component{
  static COLORDEFAULT = 'deepskyblue';
  static COLORCOMPARE = 'lightcyan';
  static COLORSORTED = 'lawngreen';
  static ms = 5;
  constructor(props){
    super(props);
    this.state = {graph:[],running:false}
    this.timeouts=[];
  }

  componentDidMount(){
    this.timeouts = [];
    this.handleReset();
  }

  addTimeoutID(id){
    this.timeouts.push(id);
  }

  clearTimeouts(){
    this.timeouts.forEach(clearTimeout);
    this.timeouts = [];
  }

  handleRun = () => {
    //animations: swap, compare, min/normmalize prev
    if(this.state.running===true){return;}
    const graph = this.state.graph.slice();
    const algorithm = document.getElementById("algorithm").value;
    var animations = [];
    switch(algorithm){
      case "selection":
        animations = this.selectionSort(graph);
        break;
      case "bubble":
        animations = this.bubbleSort(graph);
        break;
      
      case "insertion":
        animations = this.insertionSort(graph);
        break;

      case "merge":
        this.mergeSort(0,graph.length-1,graph,animations);
        console.log(graph)
        console.log(animations);
        animations.push({type:"done"});
        break;

      default:
        break;
    }
    for(let k=0;k<animations.length;k++){this.runAnimations(animations[k],k);}
    this.setState({running:true})

  }

  runAnimations(animation,timer){
    let type = animation.type;
    const ms = App.ms;
    var timerID;
    switch(type){
      case "compare":
        timerID = setTimeout(() => {
          const first = document.getElementById(animation.first);
          const second= document.getElementById(animation.second);
          var colorInitial = first.style.backgroundColor;
          const color = colorInitial === App.COLORDEFAULT ? App.COLORCOMPARE : App.COLORDEFAULT;
          first.style.backgroundColor = color;
          second.style.backgroundColor = color;
        },timer*ms)
        this.addTimeoutID(timerID);
        break;

      case "swap":
       timerID = setTimeout(() => {
          const first = document.getElementById(animation.first);
          const second = document.getElementById(animation.second);
          first.style.width = animation.width2.toString()+"%";
          second.style.width = animation.width1.toString()+"%";
        },timer*ms)
        this.addTimeoutID(timerID);
        break;
      case "done":
        timerID = setTimeout(() => {
          for(let i = 0; i < this.state.graph.length; i++){
            const index = document.getElementById(i);
            index.style.backgroundColor = App.COLORSORTED;
          }
        },timer*ms)
        this.addTimeoutID(timerID);
        break;

      case "max":
          timerID = setTimeout(() => {
          const last = document.getElementById(animation.last);
          last.style.width = animation.maxValue.toString()+"%";
          last.style.backgroundColor = App.COLORSORTED;
      },timer*ms)
        this.addTimeoutID(timerID);
        break;

        default:
          break;
    }

  }

  selectionSort(graph){
    const animations = [];
    for(let i=0; i<graph.length; i++){
      var min = graph[i];
      var index = i;
      animations.push({type:"compare",first:index,second:index})
      for(let j=i+1; j<graph.length;j++){
        animations.push({type:"compare",first:j,second:j})
        if(graph[j] < min){
          animations.push({type:"compare",first:index,second:index})
          index=j;
          min = graph[j];
        }
        else{animations.push({type:"compare",first:j,second:j})}
      }
      animations.push({type:"swap",first:i,second:index,width1:min,width2:graph[index]})
      graph[index]=graph[i];
      graph[i]=min;
      animations.push({type:"compare",first:index,second:index})
      animations.push({type:"max",last:i,maxValue:min});

    }
    return animations;
  }

  bubbleSort(graph){
    const animations = [];
    for(let i=0; i<graph.length-1; i++){
      var last = graph.length-1;
      var maxValue = graph[graph.length-1];
      for(let j=0; j<graph.length-i-1;j++){
        animations.push({type:"compare",first:j,second:j+1});
        if (graph[j]>graph[j+1]){
          animations.push({type:"swap",first:j,second:j+1, width1:graph[j],width2:graph[j+1]});
          let temp = graph[j];
          graph[j] = graph[j+1];
          graph[j+1] = temp;
        }
        animations.push({type:"compare",first:j,second:j+1});
        last = j+1;
        maxValue = graph[j+1];

      }
      animations.push({type:"max",last:last,maxValue:maxValue});
    }
    animations.push({type:"max",last:0,maxValue:graph[0]});
    return animations;
  }

  insertionSort(graph){ 
    const animations = [];
    for(let i=1; i<graph.length;i++){
      var value = graph[i];
      var j = i - 1;
      animations.push({type:"compare",first:i,second:i})
      while(j>=0 && graph[j]>value){
        animations.push({type:"compare",first:j,second:j})
        animations.push({type:"swap",first:j+1,second:j+1,width1:graph[j],width2:graph[j]})
        animations.push({type:"compare",first:j,second:j})
        graph[j+1] = graph[j];
        j=j-1
      }
      animations.push({type:"swap",first:j+1,second:j+1,width1:value,width2:value})
      graph[j+1] = value;
      animations.push({type:"compare",first:i,second:i})
      
    }
    animations.push({type:"done"})
    return animations;
  }

  mergeSort(startIndex,endIndex,graphToSort,animations){
    if (startIndex >= endIndex){return;}
    const middleIndex = Math.floor((startIndex+endIndex)/2);
    this.mergeSort(startIndex,middleIndex,graphToSort,animations);
    this.mergeSort(middleIndex+1,endIndex,graphToSort,animations);
    this.mergeHelper(startIndex,middleIndex,endIndex,graphToSort,animations);    
  }

  mergeHelper(startIndex,middleIndex,endIndex,graphToSort,animations){
    let leftIndex = startIndex;
    let originalIndex = startIndex;
    let rightIndex = middleIndex+1
    var array1Size = middleIndex - leftIndex + 1;
    var array2Size = endIndex - middleIndex;
    var left = new Array(array1Size);
    var right = new Array(array2Size);

    for (var i = 0; i<array1Size; i++) 
      left[i] = graphToSort[leftIndex + i];
    for (var j = 0; j<array2Size; j++)
     right[j] = graphToSort[middleIndex + 1 + j];

    var leftCounter = 0;
    var rightCounter = 0;
    while(leftCounter< array1Size && rightCounter<array2Size){
        animations.push({type:"compare",first:leftIndex,second:rightIndex})
        animations.push({type:"compare",first:leftIndex,second:rightIndex})
        if(left[leftCounter]<= right[rightCounter]){
          animations.push({type:"swap",first:originalIndex,second:originalIndex,width1:left[leftCounter],width2:graphToSort[originalIndex]})
          graphToSort[originalIndex++] = left[leftCounter++];
          leftIndex++;
        }
        else{
          animations.push({type:"swap",first:originalIndex,second:originalIndex,width1:right[rightCounter],width2:graphToSort[originalIndex]})
          graphToSort[originalIndex++] = right[rightCounter++]; 
          rightIndex++;
        }
    }

    while(leftCounter<array1Size){
      animations.push({type:"compare",first:leftIndex,second:leftIndex})
      animations.push({type:"compare",first:leftIndex,second:leftIndex})
      animations.push({type:"swap",first:originalIndex,second:originalIndex,width1:left[leftCounter],width2:graphToSort[originalIndex]})
      graphToSort[originalIndex++] = left[leftCounter++];
      leftIndex++;
    }
    while(rightCounter<array2Size){
      animations.push({type:"compare",first:rightIndex,second:rightIndex})
      animations.push({type:"compare",first:rightIndex,second:rightIndex})
      animations.push({type:"swap",first:originalIndex,second:originalIndex,width1:right[rightCounter],width2:graphToSort[originalIndex]})
        graphToSort[originalIndex++] = right[rightCounter++];
        rightIndex++;
    }
  }

  handleReset = () => {
    const graph = [];
    var sortSize = 100;
    for(var j = 0; j < sortSize; j++){
      var randNum = Math.floor(Math.random()*sortSize + 1);
      graph.push(randNum);
    }
    this.clearTimeouts();
    this.setState({graph,running:false},this.resetColor());
  }

  resetColor(){
    for(var i = 0; i<this.state.graph.length; i++){
      document.getElementById(i).style.backgroundColor=App.COLORDEFAULT;
    }
  }

  render(){
  const size = this.state.graph.length;
  const graph = [...this.state.graph]
  const display = [];
  for(let i=0; i<size; i++){
    var value = graph[i];
    var percent = value.toString()+"%";
    var color = App.COLORDEFAULT;
    display.push(<div key={i} id={i} className="mb-1"style={{width:percent,height:'6px',backgroundColor:color}}></div>)
  }
  return (
    <React.Fragment>
      <NavBar onRun={this.handleRun} onReset={this.handleReset}/>
      <div className="w-100 bg-dark">
        {display}
      </div>
      <h1 className="subheader">
        Unsorted
        <div className="boxhud default"></div>
        Compare
        <div className="boxhud compare"></div>
        Sorted
        <div className="boxhud sorted"></div>
      </h1>
    </React.Fragment>
  );
  }
}
export default App;
