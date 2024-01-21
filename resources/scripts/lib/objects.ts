/**
 * 提供された値がnullではないオブジェクトタイプであるかどうかを判定します。
 */
function isObject(val: unknown): val is Record<string, unknown> {
    return typeof val === 'object' && val !== null && !Array.isArray(val);
}

/**
 * キーの存在とプロトタイプの値を見て、オブジェクトが本当に空かどうかを判定します。
 */
// eslint-disable-next-line @typescript-eslint/ban-types
function isEmptyObject(val: {}): boolean {
    return Object.keys(val).length === 0 && Object.getPrototypeOf(val) === Object.prototype;
}

/**
 * TypeScriptで使用するためのヘルパー関数で、オブジェクトのすべてのキーを返しますが、
 * 扱いやすいようにタイプされた方法で返します。
 */
// eslint-disable-next-line @typescript-eslint/ban-types
function getObjectKeys<T extends {}>(o: T): (keyof T)[] {
    return Object.keys(o) as (keyof typeof o)[];
}

export { isObject, isEmptyObject, getObjectKeys };
