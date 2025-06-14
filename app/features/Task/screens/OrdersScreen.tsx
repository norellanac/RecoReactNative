import React from 'react';
import Tabs from '@/app/components/molecules/Tabs';
import ScheduledTasks from '../components/ScheduledTasks';
import InProgressTasks from '../components/InProgressTasks';
import CompletedTasks from '../components/CompletedTasks';
import CanceledTasks from '../components/CanceledTasks';

const OrdersScreen = () => {
  const tabs = [
    { title: 'Scheduled', component: <ScheduledTasks /> },
    { title: 'In Progress', component: <InProgressTasks /> },
    { title: 'Completed', component: <CompletedTasks /> },
    { title: 'Canceled', component: <CanceledTasks /> },
  ];
  return <Tabs tabs={tabs} scrollable={false} />;
};

export default OrdersScreen;
