import React from 'react'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import DragDropMulti from './DragDropMulti'

class DragDropModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entities: this.props.items || {},
      selectedTaskIds: [],
      draggingTaskId: null,
    }
  }
  componentDidMount() {
    if (this.props.items) {
      this.setState(() => ({  
        entities: this.props.items
      }))
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.items) {
      this.setState(() => ({  
        entities: nextProps.items
      }))
    }
  }
  handleSetState = (newState) => {
    this.setState(newState)
  }
  render() {
    const actions = [
      <FlatButton
        label="OK"
        primary={true}
        onClick={() => this.props.handleMultipleChangeRoute(this.state.entities)}
      />,
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.props.handleClose}
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
        <div>
          <DragDropMulti
            {...this.state}
            handleSetState={this.handleSetState}
          />
        </div>
      </Dialog>
    )
  }
}


export default DragDropModal;