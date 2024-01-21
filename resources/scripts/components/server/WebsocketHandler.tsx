import React, { useEffect, useState } from 'react';
import { Websocket } from '@/plugins/Websocket';
import { ServerContext } from '@/state/server';
import getWebsocketToken from '@/api/server/getWebsocketToken';
import ContentContainer from '@/components/elements/ContentContainer';
import { CSSTransition } from 'react-transition-group';
import Spinner from '@/components/elements/Spinner';
import tw from 'twin.macro';

const reconnectErrors = ['jwt: exp claim is invalid', 'jwt: created too far in past (denylist)'];

export default () => {
    let updatingToken = false;
    const [error, setError] = useState<'connecting' | string>('');
    const { connected, instance } = ServerContext.useStoreState((state) => state.socket);
    const uuid = ServerContext.useStoreState((state) => state.server.data?.uuid);
    const setServerStatus = ServerContext.useStoreActions((actions) => actions.status.setServerStatus);
    const { setInstance, setConnectionState } = ServerContext.useStoreActions((actions) => actions.socket);

    const updateToken = (uuid: string, socket: Websocket) => {
        if (updatingToken) return;

        updatingToken = true;
        getWebsocketToken(uuid)
            .then((data) => socket.setToken(data.token, true))
            .catch((error) => console.error(error))
            .then(() => {
                updatingToken = false;
            });
    };

    const connect = (uuid: string) => {
        const socket = new Websocket();

        socket.on('auth success', () => setConnectionState(true));
        socket.on('SOCKET_CLOSE', () => setConnectionState(false));
        socket.on('SOCKET_ERROR', () => {
            setError('connecting');
            setConnectionState(false);
        });
        socket.on('status', (status) => setServerStatus(status));

        socket.on('daemon error', (message) => {
            console.warn('デーモンソケットからのエラーメッセージ:', message);
        });

        socket.on('token expiring', () => updateToken(uuid, socket));
        socket.on('token expired', () => updateToken(uuid, socket));
        socket.on('jwt error', (error: string) => {
            setConnectionState(false);
            console.warn('WingsからのJWT検証エラー:', error);

            if (reconnectErrors.find((v) => error.toLowerCase().indexOf(v) >= 0)) {
                updateToken(uuid, socket);
            } else {
                setError(
                    'ウェブソケットの資格情報を検証中にエラーが発生しました。ページを更新してください。'
                );
            }
        });

        socket.on('transfer status', (status: string) => {
            if (status === 'starting' || status === 'success') {
                return;
            }

            // このコードはウェブソケットへの再接続を強制し、ソースノードではなくターゲットノードに接続するため、
            // ターゲットノードからの転送ログを受信できるようにします。
            socket.close();
            setError('connecting');
            setConnectionState(false);
            setInstance(null);
            connect(uuid);
        });

        getWebsocketToken(uuid)
            .then((data) => {
                // 接続してから認証トークンを設定します。
                socket.setToken(data.token).connect(data.socket);

                // それが完了したら、インスタンスを設定します。
                setInstance(socket);
            })
            .catch((error) => console.error(error));
    };

    useEffect(() => {
        connected && setError('');
    }, [connected]);

    useEffect(() => {
        return () => {
            instance && instance.close();
        };
    }, [instance]);

    useEffect(() => {
        // すでにインスタンスがあるかサーバーがない場合は、新しい接続を作成する必要がないため、
        // このプロセスから抜け出します。
        if (instance || !uuid) {
            return;
        }

        connect(uuid);
    }, [uuid]);

    return error ? (
        <CSSTransition timeout={150} in appear classNames={'fade'}>
            <div css={tw`bg-red-500 py-2`}>
                <ContentContainer css={tw`flex items-center justify-center`}>
                    {error === 'connecting' ? (
                        <>
                            <Spinner size={'small'} />
                            <p css={tw`ml-2 text-sm text-red-100`}>
                                サーバーに接続する際に問題が発生しています。しばらくお待ちください...
                            </p>
                        </>
                    ) : (
                        <p css={tw`ml-2 text-sm text-white`}>{error}</p>
                    )}
                </ContentContainer>
            </div>
        </CSSTransition>
    ) : null;
};
