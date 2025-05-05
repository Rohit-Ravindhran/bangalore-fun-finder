
import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Activity } from '@/components/ActivityCard';

interface ActivitiesTableProps {
  activities: Activity[];
}

const ActivitiesTable: React.FC<ActivitiesTableProps> = ({ activities }) => {
  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableCaption>A list of all activities in Bangalore</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price Range</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell>{activity.id}</TableCell>
              <TableCell>{activity.title}</TableCell>
              <TableCell>{activity.categoryIds.join(', ')}</TableCell>
              <TableCell>{activity.priceRange}</TableCell>
              <TableCell>{activity.location}</TableCell>
              <TableCell>{activity.date}</TableCell>
              <TableCell>{activity.time}</TableCell>
              <TableCell>{activity.lastUpdated}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ActivitiesTable;
