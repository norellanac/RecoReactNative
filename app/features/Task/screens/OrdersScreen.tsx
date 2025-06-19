import React from 'react';
import Tabs from '@/app/components/molecules/Tabs';
import TasksByStatus from '../components/TasksByStatus';
import TaskList from '../components/TaskList';
import EmptyState from '../components/EmptyState';
import { useGetOrdersQuery } from '@/app/services/ordersApi';
import { useSelector } from 'react-redux';
import { selectAuth } from '@/app/redux/slices/authSlice';

const OrdersScreen = () => {
  const { user } = useSelector(selectAuth);
  const { data, isLoading, isError, refetch } = useGetOrdersQuery(undefined, {
      refetchOnMountOrArgChange: true,
    });
  const orders = data?.data || [];
  const filteredOrders = (status: number) => 
    orders.filter(order => order.status === status && order.userId === user?.id);


  const tabs = [
    { title: 'Scheduled', render: () => <TaskList data={filteredOrders(1)}  ListEmptyComponent={<EmptyState />} /> },
    { title: 'In Progress', render: () => <TaskList data={filteredOrders(2)} ListEmptyComponent={<EmptyState />} />},
    { title: 'Completed', render: () => <TaskList data={filteredOrders(3)} ListEmptyComponent={<EmptyState />} />},
    { title: 'Canceled', render: () => <TaskList data={filteredOrders(4)} ListEmptyComponent={<EmptyState />} />},
  ];
  return <Tabs tabs={tabs} scrollable={false} />;
};

export default OrdersScreen;
