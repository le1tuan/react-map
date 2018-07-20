import React from 'react'
import Dialog from 'material-ui/Dialog';
import DragDropList from './DragDropList';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

class ModalMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      routes: this.props.items || []
    }
  }
  componentDidMount() {
    if (this.props.items) {
      this.setState(() => ({  
        routes: this.props.items
      }))
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.items) {
      this.setState(() => ({  
        routes: nextProps.items
      }))
    }
  }
  handleSubmitModal = () => {
    const newState = {
      title: this.state.routes[0].content,
      path: [],
    }
    this.state.routes.map((item) => {
      newState.path.push(item.state)
    })
    this.props.handleChangeRoute(newState)
    this.props.handleClose()
  }
  handleChangeRoute = (newRoute) => {
    this.setState({
      routes: newRoute
    })
  }
  render() {
    console.log(this.state.routes)
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.props.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onClick={this.handleSubmitModal}
      />,
    ];
    return(
      <Dialog
        title="Dialog With Actions"
        open={this.props.openModal}
        modal={false}
        onRequestClose={this.props.handleClose}
        autoScrollBodyContent={true}
        contentStyle={{
          transform: 'none',
        }}
        actions={actions}
      >
        <DragDropList
          handleChangeRoute={this.handleChangeRoute}
          items={this.state.routes}
        />
      </Dialog>
    )
  }
}


export default ModalMap;