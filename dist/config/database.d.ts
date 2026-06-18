import { Pool } from 'pg';
declare const pool: Pool;
export declare const getConnection: () => Promise<import("pg").PoolClient>;
export declare const query: (text: string, params?: any[]) => Promise<any>;
export default pool;
//# sourceMappingURL=database.d.ts.map