/**
 * 有効な6文字のHEXカラーコードを受け取り、ユーザーが制御可能なアルファチャンネルを持つ関連するRGBA値に変換します。
 */
function hexToRgba(hex: string, alpha = 1): string {
    // noinspection RegExpSimplifiable
    if (!/#?([a-fA-F0-9]{2}){3}/.test(hex)) {
        return hex;
    }

    // noinspection RegExpSimplifiable
    const [r, g, b] = hex.match(/[a-fA-F0-9]{2}/g)!.map((v) => parseInt(v, 16));

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export { hexToRgba };
