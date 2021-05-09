export const logDir = "../log";
export const secret: Secret = {};
export const responseCodes: ResponseCodes = {
    info: {
        success: 0,
    },
    warnings: {
        instanceAlreadyRunning: 20,
    },
    errors: {
        cannotImportScript: 40,
        pgError: 41,
        redisError: 42,
        fetchUrlError: 43,
        noValidProxiesFound: 44,
    },
    critical: {
        unknownError: 255,
    }
};


export const noRollbarReportCodes = [
    responseCodes.warnings.instanceAlreadyRunning,
];

export const redisOptions: RedisOptions = {
    db: 3,
    regularHost: "127.0.0.1",
    dockerHost: "redis",
    regularPort: 6380,
    dockerPort: 6379,
};

export const pgOptions: PgOptions = {
    regularHost: "127.0.0.1",
    dockerHost: "database",
    regularPort: 5433,
    dockerPort: 5432,
};

export const fetchOptions: FetchOptions = {
    defaultTimeout: 5000,
};