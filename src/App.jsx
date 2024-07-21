import React, { Component } from 'react';
import Bar from './components/Bar';
import BubbleSort from './Algorithms/BS';
import InsertionSort from './Algorithms/IS';
import SelectionSort from './Algorithms/SS';
import QuickSort from './Algorithms/QS';
import MergeShort from './Algorithms/MS';
import Scramble from './components/Scramble';


class App extends Component {
  state = {
    array: [],
    arraySteps: [],
    colorKey: [],
    colorSteps: [],
    currentStep: 0,
    count: 10,
    delay: 500,
    speed: 'Medium',
    algorithm: 'Selection Sort',
    timeouts: [],
  };

  ALGORITHMS = {
    'Bubble Sort': BubbleSort,
    'Insertion Sort': InsertionSort,
    'Selection Sort': SelectionSort,
    'Quick Sort': QuickSort,
    'Merge Sort': MergeShort,
  };

  SPEEDS = {
    'Slow': 1000,
    'Medium': 500,
    'Fast': 200,
    'Ultra Fast': 100,
  };

  componentDidMount() {
    this.generateRandomArray();
  }

  generateSteps = () => {
    let array = this.state.array.slice();
    let steps = this.state.arraySteps.slice();
    let colorSteps = this.state.colorSteps.slice();

    this.ALGORITHMS[this.state.algorithm](array, 0, steps, colorSteps);

    this.setState({
      arraySteps: steps,
      colorSteps: colorSteps,
    });
  };

  clearTimeouts = () => {
    this.state.timeouts.forEach((timeout) => clearTimeout(timeout));
    this.setState({
      timeouts: [],
    });
  };

  clearColorKey = () => {
    let blankKey = new Array(this.state.count).fill(0);

    this.setState({
      colorKey: blankKey,
      colorSteps: [blankKey],
    });
  };

  generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  generateRandomArray = () => {
    this.clearTimeouts();
    this.clearColorKey();
    const count = this.state.count;
    const temp = [];

    for (let i = 0; i < count; i++) {
      temp.push(this.generateRandomNumber(50, 200));
    }

    this.setState(
      {
        array: temp,
        arraySteps: [temp],
        currentStep: 0,
      },
      () => {
        this.generateSteps();
      }
    );
  };

  changeArray = (index, value) => {
    let arr = this.state.array;
    arr[index] = value;
    this.setState(
      {
        array: arr,
        arraySteps: [arr],
        currentStep: 0,
      },
      () => {
        this.generateSteps();
      }
    );
  };

  previousStep = () => {
    let currentStep = this.state.currentStep;
    if (currentStep === 0) return;
    currentStep -= 1;
    this.setState({
      currentStep: currentStep,
      array: this.state.arraySteps[currentStep],
      colorKey: this.state.colorSteps[currentStep],
    });
  };

  nextStep = () => {
    let currentStep = this.state.currentStep;
    if (currentStep >= this.state.arraySteps.length - 1) return;
    currentStep += 1;
    this.setState({
      currentStep: currentStep,
      array: this.state.arraySteps[currentStep],
      colorKey: this.state.colorSteps[currentStep],
    });
  };

  start = () => {
    let steps = this.state.arraySteps;
    let colorSteps = this.state.colorSteps;
    this.clearTimeouts();

    let timeouts = [];
    let i = 0;

    while (i < steps.length - this.state.currentStep) {
      let timeout = setTimeout(() => {
        let currentStep = this.state.currentStep;
        this.setState({
          array: steps[currentStep],
          colorKey: colorSteps[currentStep],
          currentStep: currentStep + 1,
        });
        timeouts.push(timeout);
      }, this.state.delay * i);
      i++;
    }

    this.setState({
      timeouts: timeouts,
    });
  };

  handleAlgorithmChange = (event) => {
    this.setState({ algorithm: event.target.value }, () => {
      this.generateSteps();
    });
  };

  handleCountChange = (event) => {
    this.setState({ count: parseInt(event.target.value) }, () => {
      this.generateRandomArray();
    });
  };

  handleSpeedChange = (event) => {
    const selectedSpeed = event.target.value;
    this.setState({
      speed: selectedSpeed,
      delay: this.SPEEDS[selectedSpeed],
    });
  };

  render() {

    let bars = this.state.array.map((value, index) => (
      <Bar
        key={index}
        index={index}
        length={value}
        color={this.state.colorKey[index]}
        changeArray={this.changeArray}
      />
    ));

    let playButton;

    if (this.state.arraySteps.length === this.state.currentStep) {
      playButton = (
        <button className='button focus:border-[#596A95] text-center text-white border-2 border-solid border-[#596A95]' onClick={this.generateRandomArray}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-arrow-repeat"
            viewBox="0 0 16 16"
          >
            <path
              d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"
            ></path>
            <path
              fillRule="evenodd"
              d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
            ></path>
          </svg>
          Reset
        </button>
      );
    } else {
      playButton = (
        <button className='signal text-white text-center border-2 focus:border-[#596A95] border-solid border-[#596A95]' onClick={this.start}>

          <span className='span1 px-0.5'>S</span>
          <span className='span2 px-0.5'>O</span>
          <span className='span3 px-0.5'>R</span>
          <span className='span4 px-0.5'>T</span>

        </button>
      );
    }

    return (
      <div className='app'>
        <Scramble />
        <div className='frame'>
          <div className='barsDiv container card'>{bars}</div>
        </div>

        <div className='control-pannel subcontainer flex gap-5'>
          <form className='flex gap-5'>
            <div className='algo'>
              <label className='text-white px-3'>Algorithm :</label>
              
                <select value={this.state.algorithm} onChange={this.handleAlgorithmChange} className="bg-[#222630] px-4 py-3 outline-none text-white hover:bg-[#282d3b] rounded-lg border-t-2 transition-colors duration-100 border-solid focus:border-[#596A95] border-[#596A95]">
                  <option value="Bubble Sort">Bubble Sort</option>
                  <option value="Insertion Sort">Insertion Sort</option>
                  <option value="Selection Sort">Selection Sort</option>
                  <option value="Quick Sort">Quick Sort</option>
                  <option value="Merge Sort">Merge Sort</option>
                </select>
              
            </div>
            <div className='algo border-1 border-white'>
              <label className='text-white px-3' >Number of Elements :</label>
              <select
                className="bg-[#222630] px-4 py-3 outline-none text-white rounded-lg border-t-2 transition-colors duration-100 border-solid focus:border-[#596A95] hover:bg-[#282d3b] border-[#596A95]"
                value={this.state.count}
                onChange={this.handleCountChange}
              >
                {Array.from({ length: 20 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            <div className='algo'>
              <label className='text-white px-3' >Speed :</label>
              <select value={this.state.speed} onChange={this.handleSpeedChange} className="bg-[#222630] px-4 py-3 outline-none text-white rounded-lg border-t-2 transition-colors duration-100 border-solid hover:bg-[#282d3b] focus:border-[#596A95] border-[#596A95]">
                <option value="Slow">Slow</option>
                <option value="Medium">Medium</option>
                <option value="Fast">Fast</option>
                <option value="Ultra Fast">Ultra Fast</option>
              </select>
            </div>
          </form>
          <div className='control-buttons'>
            {playButton}
          </div>
        </div>
        <div className='pannel'></div>
      </div>
    );
  }
}

export default App;
