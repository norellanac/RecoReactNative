import React from 'react';
import Tabs from '@/app/components/molecules/Tabs';
import ScheduledTasks from '../components/ScheduledTasks';
import CompletedTasks from '../components/CompletedTasks';

const OrdersScreen = () => {
  const tabs = [
    { title: 'Scheduled', component: <ScheduledTasks /> },
    { title: 'Completed', component: <CompletedTasks /> },
  ];
  return <Tabs tabs={tabs} scrollable={false} />;
};

export default OrdersScreen;
