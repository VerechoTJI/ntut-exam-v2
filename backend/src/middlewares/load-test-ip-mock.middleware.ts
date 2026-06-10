import { Request, Response, NextFunction } from "express";

if (process.env.LOAD_TEST_MODE === 'pure' || process.env.LOAD_TEST_MODE === 'simulation' || process.env.LOAD_TEST_MODE === 'true') {
    console.warn(`[WARNING] LOAD_TEST_MODE is set to '${process.env.LOAD_TEST_MODE}'. Load Test IP Mock is ENABLED. This should not be used in production.`);
}

export const loadTestIpMockMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // 1. 確認是否開啟壓測模式 (非常重要，避免正式環境被駭客利用)
    if (process.env.LOAD_TEST_MODE === 'pure' || process.env.LOAD_TEST_MODE === 'simulation' || process.env.LOAD_TEST_MODE === 'true') {
        
        // 2. 從 Header 讀取壓測腳本傳來的假 IP
        const fakeIp = req.headers['x-test-fake-ip'];
        
        if (typeof fakeIp === 'string' && fakeIp) {
            // 3. 覆寫 req.ip (因為 req.ip 是 getter，必須用 defineProperty 覆寫)
            Object.defineProperty(req, 'ip', {
                configurable: true,
                enumerable: true,
                get: () => fakeIp
            });

            // 為了確保萬無一失，連同 req.socket.remoteAddress 一起覆寫
            // 這樣不管後續程式碼用 req.ip 還是 req.socket.remoteAddress 都會讀到假 IP
            if (req.socket) {
                Object.defineProperty(req.socket, 'remoteAddress', {
                    configurable: true,
                    enumerable: true,
                    get: () => fakeIp
                });
            }
        }
    }
    
    // 交給下一個 Middleware 或 Controller 繼續處理
    next();
};
