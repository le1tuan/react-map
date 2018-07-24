import React from 'react'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class SelectRouteModal extends React.Component {
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
  render() {
    const actions = [
      <FlatButton
        label="OK"
        primary={true}
        onClick={this.props.handleClose}
      />,
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.props.handleClose}
      />
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
          {
            this.props.items.map((item, index) => 
              <div
                key={index}
                onClick={() => {this.props.openInfoWindow({
                  selectedMoveRoute: [item],
                  openSelectRoute: false,
                  openMoveRoute: true,
                })}}
              >
                {item.title}
              </div>
            )
          }
        </div>
      </Dialog>
    )
  }
}


export default SelectRouteModal;