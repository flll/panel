@extends('layouts.admin')

@section('title')
    ロケーション
@endsection

@section('content-header')
    <h1>ロケーション<small>ノードをより簡単に分類するために割り当てることができるすべてのロケーション。</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">管理者</a></li>
        <li class="active">ロケーション</li>
    </ol>
@endsection

@section('content')
<div class="row">
    <div class="col-xs-12">
        <div class="box box-primary">
            <div class="box-header with-border">
                <h3 class="box-title">ロケーションリスト</h3>
                <div class="box-tools">
                    <button class="btn btn-sm btn-primary" data-toggle="modal" data-target="#newLocationModal">新規作成</button>
                </div>
            </div>
            <div class="box-body table-responsive no-padding">
                <table class="table table-hover">
                    <tbody>
                        <tr>
                            <th>ID</th>
                            <th>ショートコード</th>
                            <th>説明</th>
                            <th class="text-center">ノード</th>
                            <th class="text-center">サーバー</th>
                        </tr>
                        @foreach ($locations as $location)
                            <tr>
                                <td><code>{{ $location->id }}</code></td>
                                <td><a href="{{ route('admin.locations.view', $location->id) }}">{{ $location->short }}</a></td>
                                <td>{{ $location->long }}</td>
                                <td class="text-center">{{ $location->nodes_count }}</td>
                                <td class="text-center">{{ $location->servers_count }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="newLocationModal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <form action="{{ route('admin.locations') }}" method="POST">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">ロケーションを作成</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-12">
                            <label for="pShortModal" class="form-label">ショートコード</label>
                            <input type="text" name="short" id="pShortModal" class="form-control" />
                            <p class="text-muted small">他のロケーションと区別するために使用される短い識別子です。1文字以上60文字以下である必要があります。例：<code>us.nyc.lvl3</code></p>
                        </div>
                        <div class="col-md-12">
                            <label for="pLongModal" class="form-label">説明</label>
                            <textarea name="long" id="pLongModal" class="form-control" rows="4"></textarea>
                            <p class="text-muted small">このロケーションの詳細な説明です。191文字以下である必要があります。</p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    {!! csrf_field() !!}
                    <button type="button" class="btn btn-default btn-sm pull-left" data-dismiss="modal">キャンセル</button>
                    <button type="submit" class="btn btn-success btn-sm">作成</button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection
