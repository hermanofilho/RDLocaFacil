
import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
      {description && (
        <p className="text-muted-foreground mt-2">{description}</p>
      )}
    </div>
  );
};
