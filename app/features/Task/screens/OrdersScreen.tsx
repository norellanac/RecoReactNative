import React from 'react';
import Tabs from '@/app/components/molecules/Tabs';
import TasksByStatus from '../components/TasksByStatus';

const OrdersScreen = () => {
  const tabs = [
    { title: 'Scheduled', render: () => <TasksByStatus status={1} /> },
    { title: 'In Progress', render: () => <TasksByStatus status={2} /> },
    { title: 'Completed', render: () => <TasksByStatus status={3} /> },
    { title: 'Canceled', render: () => <TasksByStatus status={4} /> },
  ];
  return <Tabs tabs={tabs} scrollable={false} />;
};

export default OrdersScreen;
