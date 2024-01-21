import Sockette from 'sockette';
import { EventEmitter } from 'events';

export class Websocket extends EventEmitter {
    // このソケットのタイマーインスタンス。
    private timer: any = null;

    // タイマーのバックオフ時間（ミリ秒）。
    private backoff = 5000;

    // 追跡されているソケットインスタンス。
    private socket: Sockette | null = null;

    // ソケットに接続するURL。
    private url: string | null = null;

    // デーモンへのすべてのリクエストに添付される認証トークン。
    // デフォルトではこのトークンは15分ごとに期限切れになるため、
    // かなり連続的な間隔で更新する必要があります。ソケットサーバーは
    // 期限が3分と0分に近づいたときに「token expiring」と「token expired」
    // のイベントで応答します。
    private token = '';

    // Websocketインスタンスに接続し、初期リクエストのためのトークンを設定します。
    connect(url: string): this {
        this.url = url;

        this.socket = new Sockette(`${this.url}`, {
            onmessage: (e) => {
                try {
                    const { event, args } = JSON.parse(e.data);
                    args ? this.emit(event, ...args) : this.emit(event);
                } catch (ex) {
                    console.warn('受信したwebsocketメッセージの解析に失敗しました。', ex);
                }
            },
            onopen: () => {
                // タイマーをクリアし、無事に接続できました。
                this.timer && clearTimeout(this.timer);
                this.backoff = 5000;

                this.emit('SOCKET_OPEN');
                this.authenticate();
            },
            onreconnect: () => {
                this.emit('SOCKET_RECONNECT');
                this.authenticate();
            },
            onclose: () => this.emit('SOCKET_CLOSE'),
            onerror: (error) => this.emit('SOCKET_ERROR', error),
        });

        this.timer = setTimeout(() => {
            this.backoff = this.backoff + 2500 >= 20000 ? 20000 : this.backoff + 2500;
            this.socket && this.socket.close();
            clearTimeout(this.timer);

            // ソケットへの接続を再試行します。
            this.connect(url);
        }, this.backoff);

        return this;
    }

    // Websocketインスタンス間でコマンドを送受信する際に使用する認証トークンを設定します。
    setToken(token: string, isUpdate = false): this {
        this.token = token;

        if (isUpdate) {
            this.authenticate();
        }

        return this;
    }

    authenticate() {
        if (this.url && this.token) {
            this.send('auth', this.token);
        }
    }

    close(code?: number, reason?: string) {
        this.url = null;
        this.token = '';
        this.socket && this.socket.close(code, reason);
    }

    open() {
        this.socket && this.socket.open();
    }

    reconnect() {
        this.socket && this.socket.reconnect();
    }

    send(event: string, payload?: string | string[]) {
        this.socket &&
            this.socket.send(
                JSON.stringify({
                    event,
                    args: Array.isArray(payload) ? payload : [payload],
                })
            );
    }
}
