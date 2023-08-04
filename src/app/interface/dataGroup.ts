export interface DataGroup {
    name: string;
    urls: string[];
    version?: number;
    cacheConfig: {
        maxSize: number;
        maxAge: string;
        timeout?: string;
        strategy?: 'freshness' | 'performance';
    }; 
}