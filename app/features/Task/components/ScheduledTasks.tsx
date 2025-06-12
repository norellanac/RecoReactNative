import React from 'react';
import TaskList from '../components/TaskList';
import EmptyState from './EmptyState';
import { useGetOrdersQuery } from '@/app/services/ordersApi';

const ScheduledTasks = () => {
  const { data, isLoading, isError } = useGetOrdersQuery();

  const orders = data?.data || [];

  const scheduledTasks = orders.filter((order) => order.status === 1);

  if (isLoading) return null; // Agregar un indicador de carga si es necesario
  if (isError) return <EmptyState />;

  return <TaskList data={scheduledTasks} ListEmptyComponent={<EmptyState />} />;
};

export default ScheduledTasks;
