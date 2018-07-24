// @flow
import React, { Component } from 'react';
import Column from './column';
import { DragDropContext } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { mutliDragAwareReorder, multiSelectTo as multiSelect } from './utils';


const getTasks = (entities, columnId) =>
  entities.columns[columnId].taskIds.map(
    (taskId) => entities.tasks[taskId],
  );

const Container = styled.div`
  display: flex;
  user-select: none;
`;
export default class DragDropMulti extends Component {
  constructor(props) {
    super(props)
    this.state = {
      entities: this.props.items || {},
      selectedTaskIds: [],
      draggingTaskId: null,
    }
  }
  componentDidMount() {
    window.addEventListener('click', this.onWindowClick);
    window.addEventListener('keydown', this.onWindowKeyDown);
    window.addEventListener('touchend', this.onWindowTouchEnd);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onWindowClick);
    window.removeEventListener('keydown', this.onWindowKeyDown);
    window.removeEventListener('touchend', this.onWindowTouchEnd);
  }

  onDragStart = (start) => {
    const id = start.draggableId;
    const selected = this.state.selectedTaskIds.find(
      (taskId) => taskId === id,
    );

    // if dragging an item that is not selected - unselect all items
    if (!selected) {
      this.unselectAll();
    }
    this.props.handleSetState({
      draggingTaskId: start.draggableId,
    });
  };

  onDragEnd = (result) => {
    const destination = result.destination;
    const source = result.source;

    // nothing to do
    if (!destination || result.reason === 'CANCEL') {
      this.props.handleSetState({
        draggingTaskId: null,
      });
      return;
    }

    const processed = mutliDragAwareReorder({
      entities: this.props.entities,
      selectedTaskIds: this.props.selectedTaskIds,
      source,
      destination,
    });
    console.log(processed, 'proceed')

    this.props.handleSetState({
      ...processed,
      draggingTaskId: null,
    }, () => {
      console.log('aoioe')
    });
  };

  onWindowKeyDown = (event) => {
    if (event.defaultPrevented) {
      return;
    }

    if (event.key === 'Escape') {
      this.unselectAll();
    }
  };

  onWindowClick = (event) => {
    if (event.defaultPrevented) {
      return;
    }
    this.unselectAll();
  };

  onWindowTouchEnd = (event) => {
    if (event.defaultPrevented) {
      return;
    }
    this.unselectAll();
  };

  toggleSelection = (taskId) => {
    const selectedTaskIds = this.props.selectedTaskIds;
    const wasSelected = selectedTaskIds.includes(taskId);

    const newTaskIds = (() => {
      // Task was not previously selected
      // now will be the only selected item
      if (!wasSelected) {
        return [taskId];
      }

      // Task was part of a selected group
      // will now become the only selected item
      if (selectedTaskIds.length > 1) {
        return [taskId];
      }

      // task was previously selected but not in a group
      // we will now clear the selection
      return [];
    })();

    this.props.handleSetState({
      selectedTaskIds: newTaskIds,
    });
  };

  toggleSelectionInGroup = (taskId) => {
    const selectedTaskIds = this.props.selectedTaskIds;
    const index = selectedTaskIds.indexOf(taskId);

    // if not selected - add it to the selected items
    if (index === -1) {
      this.props.handleSetState({
        selectedTaskIds: [...selectedTaskIds, taskId],
      });
      return;
    }

    // it was previously selected and now needs to be removed from the group
    const shallow = [...selectedTaskIds];
    shallow.splice(index, 1);
    this.props.handleSetState({
      selectedTaskIds: shallow,
    });
  };

  // This behaviour matches the MacOSX finder selection
  multiSelectTo = (newTaskId) => {
    const updated = multiSelect(
      this.props.entities,
      this.props.selectedTaskIds,
      newTaskId,
    );

    if (updated == null) {
      return;
    }

    this.props.handleSetState({
      selectedTaskIds: updated,
    });
  };

  unselect = () => {
    this.unselectAll();
  };

  unselectAll = () => {
    this.props.handleSetState({
      selectedTaskIds: [],
    });
  };

  render() {
    const entities = this.props.entities;
    const selected = this.props.selectedTaskIds;
    console.log(this.props, '-0---');
    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      >
        <Container>
          {entities.columnOrder.map((columnId) => (
            <Column
              column={entities.columns[columnId]}
              tasks={getTasks(entities, columnId)}
              selectedTaskIds={selected}
              key={columnId}
              draggingTaskId={this.props.draggingTaskId}
              toggleSelection={this.toggleSelection}
              toggleSelectionInGroup={this.toggleSelectionInGroup}
              multiSelectTo={this.multiSelectTo}
            />
          ))}
        </Container>
      </DragDropContext>
    );
  }
}