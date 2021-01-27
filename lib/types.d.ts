import type { FileMeta } from '@hkube/db/lib/DataSource';

export type LocalFileMeta = Omit<FileMeta, 'path'>;

export type DvcFileMeta = LocalFileMeta & { hash: string };

export type DvcContent = {
    outs: { md5: string; size: number; path: string }[];
    meta?: {
        hkube?: DvcFileMeta;
    };
};
