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
          title: 'Route1',
          path: [
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
          ]
        }, {
          title: 'Route2',
          path: [{
            lat: 13.78854,
            long: 100.701197,
          }, {
            lat: 13.88854,
            long: 100.801197,
          }],
        }],
      openModal: false,
      selectedPoint: null,
    }
    this.canvas = null
    this.createLatLng = this.createLatLng.bind(this)
    this.initGoogleMap = this.initGoogleMap.bind(this)
    this.renderPolyline = this.renderPolyline.bind(this)
    this.renderInfoWindow = this.renderInfoWindow.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.latestInfoWindow = null
  }
  handleChangeRoute = (newRoute) => {
    const filterState = this.state.routes.filter((route) => newRoute.title !== route.title)
    filterState.splice(0, 0, newRoute)
    this.setState({
      routes: filterState
    }, () => {
      console.log(this.state, 123123)
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
    const mapOptions = {
      center: this.createLatLng(routes[0].path[0]),
      zoom: 12,
      disableDoubleClickZoom: true,
    };
    const map = new window.google.maps.Map(canvas, mapOptions)
    const paths = [];
    routes.map((route) => {
      const specificPath = {
        title: route.title,
        path: []
      }
      route.path.reduce((value, next) => {
        const position = this.createLatLng(next);
        specificPath.path.push(position)
        return value;
      }, []);
      paths.push(specificPath)
    })
    const reSequenceWindow = this.renderInfoWindow('Re-Render');
    const moveWindow = this.renderInfoWindow('Move')  
    this.flightPath = paths.map((path) => {
      const linearPath = this.renderPolyline(path.path)
      this.addEvent(linearPath, 'click', (e) => {
        reSequenceWindow.setPosition({
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        })
        this.openInfoWindow(reSequenceWindow, map)
        document.getElementById('show-popup').addEventListener('click', () => {
          this.setState({
            openModal: true,
            selectedPoint: this.state.routes.filter((route) => route.title === path.title),
          })
        })
      })
      linearPath.setMap(map)
    })
    paths.map((path) => {
      this.marker = path.path.map(item => {
        const marker = new window.google.maps.Marker({
          position: item,
          map: map,
        });
        marker.addListener('click', () => {
          this.openInfoWindow(moveWindow, map, marker)
        })
        return marker
      })
    })
  }
  addEvent = (element, event, callback) => {
    window.google.maps.event.addListener(element, event, callback)
  }
  renderPolyline(path) {
    return new window.google.maps.Polyline({
      path: path,
      strokeColor: "#0000FF",
      strokeOpacity: 1,
      strokeWeight: 5
    });
  }
  renderInfoWindow(title) {
    const InfoContent = `<div><div id="show-popup">${title}</div></div>`
    return new window.google.maps.InfoWindow({
      content: InfoContent
    });
  }

  openInfoWindow(infoWindow, map, item = undefined) {
    if (this.latestInfoWindow) {
      this.latestInfoWindow.close()
    }
    this.latestInfoWindow = infoWindow;
    item ? this.latestInfoWindow.open(map, item) : this.latestInfoWindow.open(map)
  }

  addLatLng(event) {

  }
  componentDidMount() {
    if (window.google && window.google.maps) {
      this.initGoogleMap(this.state.routes)
    }
  }
  componentWillUpdate(nextProps, nextState) {
    if (window.google && window.google.maps) {
      this.initGoogleMap(nextState.routes)
    }
  }
  handleClose() {
    this.setState({
      openModal: false,
    })
  }
  render() {
    const { routes, selectedPoint } = this.state
    console.log(selectedPoint)
    return (
      <MuiThemeProvider >
        <div className="App">
          <div id="map" style={{ width: '100%', height: '500px' }}></div>
          <ModalMap
            openModal={this.state.openModal}
            handleClose={this.handleClose}
            items={(selectedPoint && selectedPoint[0]) ? selectedPoint[0].path.reduce((value, next, index) => {
              const position = this.createLatLng(next);
              value.push({
                id: index,
                content: `${selectedPoint[0].title}`,
                state: next,
              })
              return value;
            }, []) : []}
            handleChangeRoute={this.handleChangeRoute}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
