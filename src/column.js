// @flow
import React, { Component } from 'react';
import memoizeOne from 'memoize-one';
import { Droppable } from 'react-beautiful-dnd';
import { grid, colors, borderRadius } from './constants';
import Task from './task';
import styled from 'styled-components';

const getSelectedMap = memoizeOne((selectedTaskIds) =>
  selectedTaskIds.reduce((previous, current) => {
    previous[current] = true;
    return previous;
  }, {}),
);

const Container = styled.div`
  width: 300px;
  margin: ${grid}px;
  border-radius: ${borderRadius}px;
  border: 1px solid ${colors.grey.dark};
  background-color: ${colors.grey.medium};
  /* we want the column to take up its full height */
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  font-weight: bold;
  padding: ${grid}px;
`;

const TaskList = styled.div`
  padding: ${grid}px;
  min-height: 200px;
  flex-grow: 1;
  transition: background-color 0.2s ease;
  ${props =>
    props.isDraggingOver ? `background-color: ${colors.grey.darker}` : ''};
`;


export default class Column extends Component {
  render() {
    const column = this.props.column;
    const tasks = this.props.tasks;
    const selectedTaskIds = this.props.selectedTaskIds;
    const draggingTaskId = this.props.draggingTaskId;
    return (
      <Container>
        <Title>{column.title}</Title>
        <Droppable droppableId={column.id}>
          {(provided, snapshot) => (
            <TaskList
              innerRef={provided.innerRef}
              isDraggingOver={snapshot.isDraggingOver}
              {...provided.droppableProps}
            >
              {tasks.map((task, index) => {
                const isSelected = Boolean(
                  getSelectedMap(selectedTaskIds)[task.id],
                );
                const isGhosting =
                  isSelected &&
                  Boolean(draggingTaskId) &&
                  draggingTaskId !== task.id;
                return (
                  <Task
                    task={task}
                    index={index}
                    key={task.id}
                    isSelected={isSelected}
                    isGhosting={isGhosting}
                    selectionCount={selectedTaskIds.length}
                    toggleSelection={this.props.toggleSelection}
                    toggleSelectionInGroup={this.props.toggleSelectionInGroup}
                    multiSelectTo={this.props.multiSelectTo}
                  />
                );
              })}
              {provided.placeholder}
            </TaskList>
          )}
        </Droppable>
      </Container>
    );
  }
}