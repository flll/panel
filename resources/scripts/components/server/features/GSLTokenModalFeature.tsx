import React, { useEffect, useState } from 'react';
import { ServerContext } from '@/state/server';
import Modal from '@/components/elements/Modal';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import FlashMessageRender from '@/components/FlashMessageRender';
import useFlash from '@/plugins/useFlash';
import { SocketEvent, SocketRequest } from '@/components/server/events';
import Field from '@/components/elements/Field';
import updateStartupVariable from '@/api/server/updateStartupVariable';
import { Form, Formik } from 'formik';

interface Values {
    gslToken: string;
}

const GSLTokenModalFeature = () => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const status = ServerContext.useStoreState((state) => state.status.value);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const { connected, instance } = ServerContext.useStoreState((state) => state.socket);

    useEffect(() => {
        if (!connected || !instance || status === 'running') return;

        const errors = ['(gsl token expired)', '(account not found)'];

        const listener = (line: string) => {
            if (errors.some((p) => line.toLowerCase().includes(p))) {
                setVisible(true);
            }
        };

        instance.addListener(SocketEvent.CONSOLE_OUTPUT, listener);

        return () => {
            instance.removeListener(SocketEvent.CONSOLE_OUTPUT, listener);
        };
    }, [connected, instance, status]);

    const updateGSLToken = (values: Values) => {
        setLoading(true);
        clearFlashes('feature:gslToken');

        updateStartupVariable(uuid, 'STEAM_ACC', values.gslToken)
            .then(() => {
                if (instance) {
                    instance.send(SocketRequest.SET_STATE, 'restart');
                }

                setLoading(false);
                setVisible(false);
            })
            .catch((error) => {
                console.error(error);
                clearAndAddHttpError({ key: 'feature:gslToken', error });
            })
            .then(() => setLoading(false));
    };

    useEffect(() => {
        clearFlashes('feature:gslToken');
    }, []);

    return (
        <Formik onSubmit={updateGSLToken} initialValues={{ gslToken: '' }}>
            <Modal
                visible={visible}
                onDismissed={() => setVisible(false)}
                closeOnBackground={false}
                showSpinnerOverlay={loading}
            >
                <FlashMessageRender key={'feature:gslToken'} css={tw`mb-4`} />
                <Form>
                    <h2 css={tw`text-2xl mb-4 text-neutral-100`}>無効なGSLトークン！</h2>
                    <p css={tw`mt-4`}>
                        あなたのゲームサーバーログイントークン（GSLトークン）が無効または期限切れのようです。
                    </p>
                    <p css={tw`mt-4`}>
                        新しいものを生成して以下に入力するか、フィールドを空白のままにして完全に削除することができます。
                    </p>
                    <div css={tw`sm:flex items-center mt-4`}>
                        <Field
                            name={'gslToken'}
                            label={'GSLトークン'}
                            description={'トークンを生成するにはhttps://steamcommunity.com/dev/managegameserversにアクセスしてください。'}
                            autoFocus
                        />
                    </div>
                    <div css={tw`mt-8 sm:flex items-center justify-end`}>
                        <Button type={'submit'} css={tw`mt-4 sm:mt-0 sm:ml-4 w-full sm:w-auto`}>
                            GSLトークンを更新
                        </Button>
                    </div>
                </Form>
            </Modal>
        </Formik>
    );
};

export default GSLTokenModalFeature;
