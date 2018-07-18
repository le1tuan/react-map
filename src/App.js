import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ModalMap from './Modal';
import DrapDropList from './DragDropList';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import ActionHome from 'material-ui/svg-icons/action/home';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routes: [
        {
          lat: 13.78754,
          long: 100.601197,
        },
        {
          lat: 13.789125,
          long: 100.526517,
        },
        {
          lat: 13.80614,
          long: 100.573501
        },
      ],
      openModal: false,
    }
    this.canvas = null
    this.createLatLng = this.createLatLng.bind(this)
    this.initGoogleMap = this.initGoogleMap.bind(this)
    this.renderPolyline = this.renderPolyline.bind(this)
    this.renderInfoWindow = this.renderInfoWindow.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }
  handleChangeRoute = (newRoute) => {
    this.setState({
      routes: newRoute,
    })
  }
  createLatLng(num) {
    if (num.lat && num.long && window.google) {
      return new window.google.maps.LatLng(num.lat, num.long);
    }
    return null;
  }
  initGoogleMap(routes) {
    const canvas = document.getElementById("map");
    const mapOptions = {center: this.createLatLng(routes[0]), zoom: 12};
    const map = new window.google.maps.Map(canvas, mapOptions)
    const path = routes.reduce((value, next) => {
      const position = this.createLatLng(next);
      value.push(position)
      return value;
    }, []);
    const infoWindow = this.renderInfoWindow();
    this.flightPath = this.renderPolyline(path)
    this.flightPath.setMap(map)
    this.marker = path.map((item) => {
      return new window.google.maps.Marker({
        position: item,
        map: map,
      }); 
    })
    this.marker = this.marker.map((item) => {
      item.addListener('click', () => {
        infoWindow.open(map, item)
        document.getElementById('show-popup').addEventListener('click', () => {
          this.setState({
            openModal: true,
          })
        })
      })
      return item
    })
  }
  renderPolyline(path) {
    return new window.google.maps.Polyline({
      path: path,
      strokeColor: "#0000FF",
      strokeOpacity: 0.8,
      strokeWeight: 2
    });
  }
  renderInfoWindow() {
    const InfoContent = `<div><div id="show-popup">Re-Sequence</div></div>`
    return new window.google.maps.InfoWindow({
      content: InfoContent
    });
  }
  addLatLng(event) {
    
  }
  componentDidMount() {
    if (window.google && window.google.maps) {
      this.initGoogleMap(this.state.routes)
    }
  }
  componentDidUpdate() {
    if (window.google && window.google.maps) {
      this.initGoogleMap(this.state.routes)
    }
  }
  handleClose() {
    this.setState({
      openModal: false,
    })
  }
  render() {
    const {routes} = this.state
    return (
      <MuiThemeProvider >
        <div className="App">
          <div id="map" style={{width:'100%', height: '500px'}}></div>
          <ModalMap
            openModal={this.state.openModal}
            handleClose={this.handleClose}
            items={routes.reduce((value, next, index) => {
              const position = this.createLatLng(next);
              value.push({
                id: index,
                content: `${next.lat}/${next.long}`,
                state: next,
              })
              return value;
            }, [])}
            handleChangeRoute={this.handleChangeRoute}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
