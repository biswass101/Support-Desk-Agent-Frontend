import React from 'react';
import { User, ShieldCheck, Hash } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Customer } from '@/types';

interface CustomerInfoCardProps {
  customer: Customer;
}

export function CustomerInfoCard({ customer }: CustomerInfoCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <span>Customer Metadata</span>
          </CardTitle>
          <Badge variant="outline" className="text-xs font-mono">
            {customer.currentTier} Tier
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        <div className="flex items-center justify-between py-1 border-b">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <Hash className="h-3.5 w-3.5" />
            <span>Customer External ID</span>
          </span>
          <span className="font-mono font-semibold text-foreground">
            {customer.externalId}
          </span>
        </div>

        <div className="flex items-center justify-between py-1 border-b">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            <span>Customer Name</span>
          </span>
          <span className="font-medium text-foreground">
            {customer.name || 'Not provided'}
          </span>
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Subscription Status</span>
          </span>
          <span className="font-medium text-foreground">
            {customer.currentTier} Plan
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
