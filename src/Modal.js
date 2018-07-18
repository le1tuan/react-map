import React from 'react'
import Dialog from 'material-ui/Dialog';
import DragDropList from './DragDropList';

class ModalMap extends React.Component {
  render() {
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
      >
        <DragDropList
          {...this.props}
        />
      </Dialog>
    )
  }
}


export default ModalMap;