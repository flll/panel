import { MarkRequired } from 'ts-essentials';
import { FractalResponseData, FractalResponseList } from '../http';

export type UUID = string;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Model {}

interface ModelWithRelationships extends Model {
    relationships: Record<string, FractalResponseData | FractalResponseList | undefined>;
}

/**
 * モデルにオプショナルなリレーションシップを持たせ、特定のパスウェイで存在していると
 * マークすることができます。これにより、異なるAPIコールがレスポンスオブジェクトの
 * "完全性"を指定できるようになり、すべてのAPIが同じ情報を返す必要がなくなり、
 * すべてのロジックが明示的なnullチェックを行う必要がなくなります。
 *
 * 例：
 *  >> const user: WithLoaded<User, 'servers'> = {};
 *  >> // "user.servers" はもはや潜在的にundefinedではありません。
 */
type WithLoaded<M extends ModelWithRelationships, R extends keyof M['relationships']> = M & {
    relationships: MarkRequired<M['relationships'], R>;
};

/**
 * APIリクエスト関数を特定の型で与えることによって、オブジェクトの型を推論するための
 * ヘルパータイプです。例えば：
 *
 * type Egg = InferModel<typeof getEgg>;
 */
export type InferModel<T extends (...args: any) => any> = ReturnType<T> extends Promise<infer U> ? U : T;
