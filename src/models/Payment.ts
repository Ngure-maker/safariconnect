export interface Payment {
  id?: number;
  invoice_number: string;
  booking_id: number;
  tourist_id: number;
  amount: number;
  payment_method: 'Mpesa' | 'Visa' | 'Mastercard' | 'Cash' | 'Bank Transfer';
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_date: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface PaymentDetail extends Payment {
  tourist_name?: string;
  tourist_email?: string;
  booking_reference?: string;
}
