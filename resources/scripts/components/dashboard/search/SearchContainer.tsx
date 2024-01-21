import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import useEventListener from '@/plugins/useEventListener';
import SearchModal from '@/components/dashboard/search/SearchModal';
import Tooltip from '@/components/elements/tooltip/Tooltip';

export default () => {
    const [表示, 設定表示] = useState(false);

    useEventListener('keydown', (e: KeyboardEvent) => {
        if (['input', 'textarea'].indexOf(((e.target as HTMLElement).tagName || 'input').toLowerCase()) < 0) {
            if (!表示 && e.metaKey && e.key.toLowerCase() === '/') {
                設定表示(true);
            }
        }
    });

    return (
        <>
            {表示 && <SearchModal appear visible={表示} onDismissed={() => 設定表示(false)} />}
            <Tooltip placement={'bottom'} content={'検索'}>
                <div className={'navigation-link'} onClick={() => 設定表示(true)}>
                    <FontAwesomeIcon icon={faSearch} />
                </div>
            </Tooltip>
        </>
    );
};
