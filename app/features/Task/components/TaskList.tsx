import React from 'react';
import { FlatList } from 'react-native';
import TaskCard from './TaskCard';

const TaskList = ({ data, ListEmptyComponent }) => (
  <FlatList
    data={data}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => <TaskCard task={item} />}
    contentContainerStyle={{ padding: 16, flexGrow: 1 }}
    ListEmptyComponent={ListEmptyComponent}
  />
);

export default TaskList;
