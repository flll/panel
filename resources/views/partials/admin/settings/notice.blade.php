@section('settings::notice')
    @if(config('pterodactyl.load_environment_only', false))
        <div class="row">
            <div class="col-xs-12">
                <div class="alert alert-danger">
                    あなたのパネルは現在、環境のみから設定を読み込むように設定されています。動的に設定を読み込むためには、環境ファイルで<code>APP_ENVIRONMENT_ONLY=false</code>を設定する必要があります。
                </div>
            </div>
        </div>
    @endif
@endsection
