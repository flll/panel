import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export function usePersistedState<S = undefined>(
    key: string,
    defaultValue: S
): [S | undefined, Dispatch<SetStateAction<S | undefined>>] {
    const [state, setState] = useState(() => {
        try {
            const item = localStorage.getItem(key);

            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.warn('ストアから永続化された値を取得できませんでした。', e);

            return defaultValue;
        }
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    return [state, setState];
}
