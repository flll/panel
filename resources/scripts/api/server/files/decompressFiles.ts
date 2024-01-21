import http from '@/api/http';

export default async (uuid: string, directory: string, file: string): Promise<void> => {
    await http.post(
        `/api/client/servers/${uuid}/files/decompress`,
        { root: directory, file },
        {
            timeout: 300000,
            timeoutErrorMessage:
                'このアーカイブの解凍に時間がかかっているようです。完了次第、解凍されたファイルが表示されます。',
        }
    );
};
