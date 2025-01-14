<?php

return [
    'sign_in' => 'サインイン',
    'go_to_login' => 'ログインに進む',
    'failed' => 'アカウント情報に一致するアカウントが見つかりませんでした',

    'forgot_password' => [
        'label' => 'パスワードを忘れましたか？',
        'label_help' => 'アカウントのメールアドレスを入力して、パスワードのリセット手順を受け取ってください',
        'button' => 'アカウントを回復',
    ],

    'reset_password' => [
        'button' => 'リセットしてサインイン',
    ],

    'two_factor' => [
        'label' => '2要素トークン',
        'label_help' => 'このアカウントは続行するために二次認証が必要です。ログインを完了するために、デバイスが生成したコードを入力してください',
        'checkpoint_failed' => '二要素認証トークンが無効でした',
    ],

    'throttle' => 'ログイン試行が多すぎます。 :seconds 秒後に再試行してください',
    'password_requirements' => 'パスワードは最低8文字で、このサイトに固有のものでなければなりません',
    '2fa_must_be_enabled' => '管理者は、パネルを使用するためにあなたのアカウントで2要素認証を有効にすることを要求しています',
];
