import React from 'react';
import Tabs from '@/app/components/molecules/Tabs';
import TaskList from '../components/TaskList';
import EmptyState from '../components/EmptyState';
import { useGetOrdersQuery } from '@/app/services/ordersApi';
import { useSelector } from 'react-redux';
import { selectAuth } from '@/app/redux/slices/authSlice';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/app/theme/colors';
import { Text } from '@/app/components/atoms';

const OrdersScreen = () => {
  const { user } = useSelector(selectAuth);
  const { data } = useGetOrdersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const orders =
    data && 'data' in data && Array.isArray(data.data) ? data.data : [];
  const userId = user && ('data' in user ? user.data.id : user.id);
  const filteredOrders = (status: number) =>
    orders.filter(
      (order: any) => order.status === status && order.userId === userId,
    );

  const tabs = [
    {
      title: `Scheduled (${filteredOrders(1).length})`,
      render: () => (
        <TaskList
          data={filteredOrders(1)}
          ListEmptyComponent={<EmptyState />}
        />
      ),
    },
    {
      title: `In Progress (${filteredOrders(2).length})`,
      render: () => (
        <TaskList
          data={filteredOrders(2)}
          ListEmptyComponent={<EmptyState />}
        />
      ),
    },
    {
      title: `Completed (${filteredOrders(3).length})`,
      render: () => (
        <TaskList
          data={filteredOrders(3)}
          ListEmptyComponent={<EmptyState />}
        />
      ),
    },
    {
      title: `Canceled (${filteredOrders(4).length})`,
      render: () => (
        <TaskList
          data={filteredOrders(4)}
          ListEmptyComponent={<EmptyState />}
        />
      ),
    },
  ];
  return (
    <Tabs tabs={tabs} scrollable={false} tabTextStyle={{ fontSize: 12 }} />
  );
};

export default OrdersScreen;
