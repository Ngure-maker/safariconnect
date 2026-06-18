export interface User {
    id?: number;
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'guide' | 'receptionist';
    created_at?: Date;
    updated_at?: Date;
}
export interface UserLogin {
    username: string;
    password: string;
}
export interface AuthPayload {
    id: number;
    username: string;
    role: string;
}
//# sourceMappingURL=User.d.ts.map