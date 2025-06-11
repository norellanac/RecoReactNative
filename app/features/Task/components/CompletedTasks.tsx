import React from 'react';
import TaskList from './TaskList';
import EmptyState from './EmptyState';

// Ejemplo de datos
const completedTasks = [
  // ...tareas completadas
];

const CompletedTasks = () => (
  <TaskList
    data={completedTasks}
    ListEmptyComponent={<EmptyState onSearch={() => {}} />}
  />
);

export default CompletedTasks;
