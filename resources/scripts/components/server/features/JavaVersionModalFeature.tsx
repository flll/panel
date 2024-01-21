import React, { useEffect, useState } from 'react';
import { ServerContext } from '@/state/server';
import Modal from '@/components/elements/Modal';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import setSelectedDockerImage from '@/api/server/setSelectedDockerImage';
import FlashMessageRender from '@/components/FlashMessageRender';
import useFlash from '@/plugins/useFlash';
import { SocketEvent, SocketRequest } from '@/components/server/events';
import Select from '@/components/elements/Select';
import useWebsocketEvent from '@/plugins/useWebsocketEvent';
import Can from '@/components/elements/Can';
import getServerStartup from '@/api/swr/getServerStartup';
import InputSpinner from '@/components/elements/InputSpinner';

const MATCH_ERRORS = [
    'minecraft 1.17はjava 16以上でサーバーを実行する必要があります',
    'minecraft 1.18はjava 17以上でサーバーを実行する必要があります',
    'java.lang.unsupportedclassversionerror',
    'サポートされていないメジャー.マイナーバージョン',
    'javaランタイムのより新しいバージョンでコンパイルされています',
];

const JavaVersionModalFeature = () => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedVersion, setSelectedVersion] = useState('');

    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const status = ServerContext.useStoreState((state) => state.status.value);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const { instance } = ServerContext.useStoreState((state) => state.socket);

    const { data, isValidating, mutate } = getServerStartup(uuid, null, { revalidateOnMount: false });

    useEffect(() => {
        if (!visible) return;

        mutate().then((value) => {
            setSelectedVersion(Object.values(value?.dockerImages || [])[0] || '');
        });
    }, [visible]);

    useWebsocketEvent(SocketEvent.CONSOLE_OUTPUT, (data) => {
        if (status === 'running') return;

        if (MATCH_ERRORS.some((p) => data.toLowerCase().includes(p.toLowerCase()))) {
            setVisible(true);
        }
    });

    const updateJava = () => {
        setLoading(true);
        clearFlashes('feature:javaVersion');

        setSelectedDockerImage(uuid, selectedVersion)
            .then(() => {
                if (status === 'offline' && instance) {
                    instance.send(SocketRequest.SET_STATE, 'restart');
                }
                setVisible(false);
            })
            .catch((error) => clearAndAddHttpError({ key: 'feature:javaVersion', error }))
            .then(() => setLoading(false));
    };

    useEffect(() => {
        clearFlashes('feature:javaVersion');
    }, []);

    return (
        <Modal
            visible={visible}
            onDismissed={() => setVisible(false)}
            closeOnBackground={false}
            showSpinnerOverlay={loading}
        >
            <FlashMessageRender key={'feature:javaVersion'} css={tw`mb-4`} />
            <h2 css={tw`text-2xl mb-4 text-neutral-100`}>サポートされていないJavaバージョン</h2>
            <p css={tw`mt-4`}>
                このサーバーは現在サポートされていないバージョンのJavaを実行しており、起動できません。
                <Can action={'startup.docker-image'}>
                    &nbsp;サーバーの起動を続行するには、以下のリストからサポートされているバージョンを選択してください。
                </Can>
            </p>
            <Can action={'startup.docker-image'}>
                <div css={tw`mt-4`}>
                    <InputSpinner visible={!data || isValidating}>
                        <Select disabled={!data} onChange={(e) => setSelectedVersion(e.target.value)}>
                            {!data ? (
                                <option disabled />
                            ) : (
                                Object.keys(data.dockerImages).map((key) => (
                                    <option key={key} value={data.dockerImages[key]}>
                                        {key}
                                    </option>
                                ))
                            )}
                        </Select>
                    </InputSpinner>
                </div>
            </Can>
            <div css={tw`mt-8 flex flex-col sm:flex-row justify-end sm:space-x-4 space-y-4 sm:space-y-0`}>
                <Button isSecondary onClick={() => setVisible(false)} css={tw`w-full sm:w-auto`}>
                    キャンセル
                </Button>
                <Can action={'startup.docker-image'}>
                    <Button onClick={updateJava} css={tw`w-full sm:w-auto`}>
                        Dockerイメージを更新
                    </Button>
                </Can>
            </div>
        </Modal>
    );
};

export default JavaVersionModalFeature;
