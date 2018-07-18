import React from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import init from './data';
import { mutliDragAwareReorder, multiSelectTo as multiSelect } from './utils';
export default class DragDropList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cards: [1,2,3,4,5,6],
      selectedTaskIds: [],
      entities: init,
      draggingTaskId: null,
    }
  }
  onDragStart = (start) => {
    const id = start.draggableId;
    const selected = this.state.selectedTaskIds.find((taskId) => taskId === id)
    if (!selected) {
      this.unselectAll();
    }
    this.setState({
      draggingTaskId: start.draggableId,
    })
  }
  onDragEnd = (result) => {
    const destination = result.destination;
    const source = result.source;
    if (!destination || result.reason === 'CANCEL') {
      this.setState({
        draggingTaskId: null,
      })
      return;
    }
    const processed = mutliDragAwareReorder({
      entities: this.state.entities,
      selectedTaskIds: this.state.selectedTaskIds,
      source,
      destination,
    })
    this.setState({
      ...processed,
      draggingTaskId: null
    })
  }
  onWindowKeyDown = (event) => {
    if (event.defaultPrevented) {
      return ;
    }
    if (event.key === 'Escape') {
      this.unselectAll();
    }
  }

  onWindowClick = (event) => {
    if (event.defaultPrevented) {
      return ;
    }
    if (event.key === 'Escape') {
      this.unselectAll();
    }
  }

  onWindowTouchEnd = (event) => {
    if (event.defaultPrevented) {
      return;
    }
    this.unselectAll();
  }
  toggleSelection = (taskId) => {
    const selectedTaskIds = this.state.selectedTaskIds;
    const wasSelected = selectedTaskIds.includes(taskId);
    const newTaskIds = (() => {
      if (!wasSelected) {
        return [taskId]
      }
      if (selectedTaskIds.length > 1) {
        return [taskId]
      }
      return []
    })();
    this.setState({
      selectedTaskIds: newTaskIds,
    })
  }
  toggleSelectionInGroup = (taskId) => {
    const selectedTaskIds = this.state.selectedTaskIds;
    const index = selectedTaskIds.indexOf(taskId)
    if (index === -1) {
      this.setState({
        selectedTaskIds: [...selectedTaskIds, taskId],
      })
      return;
    }
    const shallow = [...selectedTaskIds];
    shallow.splice(index, 1);
    this.setState({
      selectedTaskIds: shallow,
    })
  }

  multiSelectTo = (newTaskId) => {
    const updated = this.multiSelect(
      this.state.entities,
      this.state.selectedTaskIds,
      newTaskId,
    )
    if (updated === null) {
      return ;
    }
    this.setState({
      selectedTaskIds: updated
    })
  }

  unselect = () => {
    this.unselectAll()
  }
  unselectAll = () => {
    this.setState({
      selectedTaskIds: [],
    })
  }
  render() {
    const entities = this.state.entities;
    const selected = this.state.selectedTaskIds;
    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      >
        <div>
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
        </div>
      </DragDropContext>
    )
  }
}