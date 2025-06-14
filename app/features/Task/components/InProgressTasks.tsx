import React from 'react';
import TaskList from '../components/TaskList';
import EmptyState from './EmptyState';
import { useGetOrdersQuery } from '@/app/services/ordersApi';

const InProgressTasks = () => {
  const { data, isLoading, isError } = useGetOrdersQuery();

  const orders = data?.data || [];

  const InProgressTasks = orders.filter((order) => order.status === 2);

  if (isLoading) return null; // Agregar un indicador de carga si es necesario
  if (isError) return <EmptyState />;

  return (
    <TaskList data={InProgressTasks} ListEmptyComponent={<EmptyState />} />
  );
};

export default InProgressTasks;
