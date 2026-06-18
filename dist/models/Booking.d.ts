export interface Booking {
    id?: number;
    tourist_id: number;
    package_id: number;
    destination_id: number;
    accommodation_id: number;
    vehicle_id?: number;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    total_amount: number;
    booking_date: string;
    created_at?: Date;
    updated_at?: Date;
}
export interface BookingDetail extends Booking {
    tourist_name?: string;
    tourist_email?: string;
    tourist_phone?: string;
    package_name?: string;
    package_duration?: number;
    destination_name?: string;
    accommodation_name?: string;
    accommodation_location?: string;
    vehicle_name?: string;
    vehicle_reg?: string;
}
//# sourceMappingURL=Booking.d.ts.map