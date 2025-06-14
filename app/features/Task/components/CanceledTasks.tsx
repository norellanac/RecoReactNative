import React from 'react';
import TaskList from '../components/TaskList';
import EmptyState from './EmptyState';
import { useGetOrdersQuery } from '@/app/services/ordersApi';

const CanceledTasks = () => {
  const { data, isLoading, isError } = useGetOrdersQuery();

  const orders = data?.data || [];

  const CanceledTasks = orders.filter((order) => order.status === 4);

  if (isLoading) return null; // Agregar un indicador de carga si es necesario
  if (isError) return <EmptyState />;

  return <TaskList data={CanceledTasks} ListEmptyComponent={<EmptyState />} />;
};

export default CanceledTasks;
