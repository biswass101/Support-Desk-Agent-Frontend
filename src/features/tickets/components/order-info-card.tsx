import React from 'react';
import { Package, HelpCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface OrderInfoCardProps {
  orderId: string | null;
}

export function OrderInfoCard({ orderId }: OrderInfoCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" />
            <span>Associated Order</span>
          </CardTitle>
          {orderId ? (
            <Badge variant="info" className="text-xs font-mono">
              Order Attached
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs">
              No Order
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="text-xs">
        {orderId ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between py-1 border-b">
              <span className="text-muted-foreground">Order Reference Number</span>
              <span className="font-mono font-bold text-primary text-sm">
                {orderId}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground pt-1">
              Backend tool &apos;get_order_status&apos; will look up live tracking for this reference.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-4 text-center space-y-1.5 bg-muted/20">
            <HelpCircle className="h-4 w-4 text-muted-foreground mx-auto" />
            <p className="font-medium text-foreground">No Associated Order</p>
            <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
              This ticket is an account or general product question without a specific shipment reference.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
