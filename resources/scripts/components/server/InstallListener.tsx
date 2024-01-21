import useWebsocketEvent from '@/plugins/useWebsocketEvent';
import { ServerContext } from '@/state/server';
import { SocketEvent } from '@/components/server/events';
// 'swr'モジュールのインポートは削除されました。
import { getDirectorySwrKey } from '@/plugins/useFileManagerSwr';

const InstallListener = () => {
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const getServer = ServerContext.useStoreActions((actions) => actions.server.getServer);
    const setServerFromState = ServerContext.useStoreActions((actions) => actions.server.setServerFromState);

    useWebsocketEvent(SocketEvent.BACKUP_RESTORE_COMPLETED, () => {
        // mutate関数の呼び出しは削除されました。
        setServerFromState((s) => ({ ...s, status: null }));
    });

    // インストール完了イベントをリッスンし、更新されたサーバー情報を取得するリクエストを発火します。
    // これにより、ユーザーがページに留まっているだけでサーバーが自動的に利用可能になります。
    useWebsocketEvent(SocketEvent.INSTALL_COMPLETED, () => {
        getServer(uuid).catch((error) => console.error(error));
    });

    // インストール開始イベントを検出したら、すぐに状態を更新してインストール中であることを示します。
    // これにより、画面が自動的に更新されます。
    useWebsocketEvent(SocketEvent.INSTALL_STARTED, () => {
        setServerFromState((s) => ({ ...s, status: 'installing' }));
    });

    return null;
};

export default InstallListener;
