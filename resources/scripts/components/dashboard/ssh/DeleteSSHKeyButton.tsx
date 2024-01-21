import tw from 'twin.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { useFlashKey } from '@/plugins/useFlash';
import { deleteSSHKey, useSSHKeys } from '@/api/account/ssh-keys';
import { Dialog } from '@/components/elements/dialog';
import Code from '@/components/elements/Code';

export default ({ name, fingerprint }: { name: string; fingerprint: string }) => {
    const { clearAndAddHttpError } = useFlashKey('account');
    const [表示, 設定表示] = useState(false);
    const { mutate } = useSSHKeys();

    const onClick = () => {
        clearAndAddHttpError();

        Promise.all([
            mutate((data) => data?.filter((value) => value.fingerprint !== fingerprint), false),
            deleteSSHKey(fingerprint),
        ]).catch((error) => {
            mutate(undefined, true).catch(console.error);
            clearAndAddHttpError(error);
        });
    };

    return (
        <>
            <Dialog.Confirm
                open={表示}
                title={'SSHキーを削除'}
                confirm={'キーを削除'}
                onConfirmed={onClick}
                onClose={() => 設定表示(false)}
            >
                <Code>{name}</Code> SSHキーを削除すると、パネル全体での使用が無効になります。
            </Dialog.Confirm>
            <button css={tw`ml-4 p-2 text-sm`} onClick={() => 設定表示(true)}>
                <FontAwesomeIcon
                    icon={faTrashAlt}
                    css={tw`text-neutral-400 hover:text-red-400 transition-colors duration-150`}
                />
            </button>
        </>
    );
};
