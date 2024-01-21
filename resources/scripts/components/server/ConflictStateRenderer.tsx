import React from 'react';
import { ServerContext } from '@/state/server';
import ScreenBlock from '@/components/elements/ScreenBlock';
import ServerInstallSvg from '@/assets/images/server_installing.svg';
import ServerErrorSvg from '@/assets/images/server_error.svg';
import ServerRestoreSvg from '@/assets/images/server_restore.svg';

export default () => {
    const status = ServerContext.useStoreState((state) => state.server.data?.status || null);
    const isTransferring = ServerContext.useStoreState((state) => state.server.data?.isTransferring || false);
    const isNodeUnderMaintenance = ServerContext.useStoreState(
        (state) => state.server.data?.isNodeUnderMaintenance || false
    );

    return status === 'installing' || status === 'install_failed' || status === 'reinstall_failed' ? (
        <ScreenBlock
            title={'インストーラーを実行中'}
            image={ServerInstallSvg}
            message={'サーバーは間もなく準備が整います、数分後に再度お試しください。'}
        />
    ) : status === 'suspended' ? (
        <ScreenBlock
            title={'サーバーが停止中'}
            image={ServerErrorSvg}
            message={'このサーバーは停止しており、アクセスできません。'}
        />
    ) : isNodeUnderMaintenance ? (
        <ScreenBlock
            title={'ノードがメンテナンス中'}
            image={ServerErrorSvg}
            message={'このサーバーのノードは現在メンテナンス中です。'}
        />
    ) : (
        <ScreenBlock
            title={isTransferring ? '転送中' : 'バックアップからの復元'}
            image={ServerRestoreSvg}
            message={
                isTransferring
                    ? 'サーバーは新しいノードに転送されています、後ほど確認してください。'
                    : 'サーバーは現在バックアップから復元されています、数分後に再度確認してください。'
            }
        />
    );
};
