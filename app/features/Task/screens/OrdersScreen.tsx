import React from 'react';
import Tabs from '@/app/components/molecules/Tabs';
import TaskList from '../components/TaskList';
import EmptyState from '../components/EmptyState';
import { useGetOrdersQuery } from '@/app/services/ordersApi';
import { useSelector } from 'react-redux';
import { selectAuth } from '@/app/redux/slices/authSlice';
import { useHasRole } from '@/app/hooks/useHasRole';
import { useLabels } from '@/app/hooks/useLabels';

const OrdersScreen = () => {
  const { user } = useSelector(selectAuth);
  const isMerchant = useHasRole('Merchant');
  const { order: O } = useLabels();
  const { data } = useGetOrdersQuery(undefined, { refetchOnMountOrArgChange: true });

  const orders = data && 'data' in data && Array.isArray(data.data) ? data.data : [];
  const userId = user && ('data' in user ? user.data.id : user.id);

  const filteredOrders = (status: number) =>
    orders.filter((order: any) => {
      if (order.status !== status) return false;
      if (isMerchant) {
        return order.details?.[0]?.productService?.userId === userId;
      }
      return order.userId === userId;
    });

  const tabs = [
    {
      title: `${O.statuses.pending} (${filteredOrders(1).length})`,
      render: () => <TaskList data={filteredOrders(1)} ListEmptyComponent={<EmptyState />} />,
    },
    {
      title: `${O.statuses.confirmed} (${filteredOrders(2).length})`,
      render: () => <TaskList data={filteredOrders(2)} ListEmptyComponent={<EmptyState />} />,
    },
    {
      title: `${O.statuses.completed} (${filteredOrders(3).length})`,
      render: () => <TaskList data={filteredOrders(3)} ListEmptyComponent={<EmptyState />} />,
    },
    {
      title: `${O.statuses.cancelled} (${filteredOrders(4).length})`,
      render: () => <TaskList data={filteredOrders(4)} ListEmptyComponent={<EmptyState />} />,
    },
  ];

  return <Tabs tabs={tabs} scrollable={false} tabTextStyle={{ fontSize: 12 }} />;
};

export default OrdersScreen;
