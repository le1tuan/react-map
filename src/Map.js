import React, { Component } from 'react';
import isEqual from 'lodash.isequal';

export default class Map extends React.Component { 
  constructor(props) {
    super(props)
    this.canvas = null
    this.createLatLng = this.createLatLng.bind(this)
    this.initGoogleMap = this.initGoogleMap.bind(this)
    this.renderPolyline = this.renderPolyline.bind(this)
    this.renderInfoWindow = this.renderInfoWindow.bind(this)
    this.latestInfoWindow = null
  }
  shouldComponentUpdate(nextProps) {
    console.log(isEqual(this.props.routes, nextProps.routes), this.props.routes, nextProps.routes)
    if (isEqual(this.props.routes, nextProps.routes)) {
      return false;
    }
    return true;
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
          if (this.props.routes) {
            this.props.openInfoWindow({
              openModal: true,
              selectedPoint: this.props.routes.filter((route) => route.title === path.title),
            })
          }
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
    item ? infoWindow.open(map, item) : infoWindow.open(map)
  }

  componentDidMount() {
    if (this.props.routes) {
      this.initGoogleMap(this.props.routes)
    }
  }

  componentWillUpdate(nextProps, nextState) {
    this.initGoogleMap(nextProps.routes)
  }

  render() {
    return (
      <div id="map" style={{ width: '100%', height: '500px' }}></div>
    )
  }
}