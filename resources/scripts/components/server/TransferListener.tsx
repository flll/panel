import useWebsocketEvent from '@/plugins/useWebsocketEvent';
import { ServerContext } from '@/state/server';
import { SocketEvent } from '@/components/server/events';

const TransferListener = () => {
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const getServer = ServerContext.useStoreActions((actions) => actions.server.getServer);
    const setServerFromState = ServerContext.useStoreActions((actions) => actions.server.setServerFromState);

    // サーバーの状態を更新するために転送ステータスイベントをリッスンします。
    useWebsocketEvent(SocketEvent.TRANSFER_STATUS, (status: string) => {
        if (status === 'pending' || status === 'processing') {
            setServerFromState((s) => ({ ...s, isTransferring: true }));
            return;
        }

        if (status === 'failed') {
            setServerFromState((s) => ({ ...s, isTransferring: false }));
            return;
        }

        if (status !== 'completed') {
            return;
        }

        // ノードと割り当てが更新されたので、サーバーの情報をリフレッシュします。
        getServer(uuid).catch((error) => console.error(error));
    });

    return null;
};

export default TransferListener;
