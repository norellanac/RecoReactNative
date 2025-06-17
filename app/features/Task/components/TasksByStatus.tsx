import React, { useEffect } from 'react';
import TaskList from './TaskList';
import EmptyState from './EmptyState';
import { useGetOrdersQuery } from '@/app/services/ordersApi';
import { useSelector } from 'react-redux';
import { selectAuth } from '@/app/redux/slices/authSlice';

const TasksByStatus = ({ status }) => {
  const { data, isLoading, isError, refetch } = useGetOrdersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { user } = useSelector(selectAuth);
  const userId = user?.id;

  useEffect(() => {
    refetch();
  }, [status, refetch]);

  const orders =
    data?.data?.filter(
      (order) =>
        order.userId === userId && Number(order.status) === Number(status),
    ) || [];

  //   console.log('status prop:', status, typeof status);
  //   console.log('orders from backend:', data?.data);
  //   console.log('filtered orders:', orders);

  //   console.log('orders:', data?.data);

  if (isLoading) return null;
  if (isError) return <EmptyState />;

  return <TaskList data={orders} ListEmptyComponent={<EmptyState />} />;
};

export default TasksByStatus;
