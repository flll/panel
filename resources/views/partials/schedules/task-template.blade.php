@section('tasks::chain-template')
<div class="box-footer with-border task-list-item" data-target="task-clone">
    <div class="row">
        <div class="form-group col-md-3">
            <label class="control-label">スケジュールタスクの時間</label>
            <div class="row">
                <div class="col-xs-4">
                    <select name="tasks[time_value][]" class="form-control">
                        @foreach(range(0, 59) as $number)
                            <option value="{{ $number }}">{{ $number }}</option>
                        @endforeach
                    </select>
                </div>
                <div class="col-xs-8">
                    <select name="tasks[time_interval][]" class="form-control">
                        <option value="s">秒</option>
                        <option value="m">分</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="form-group col-md-3">
            <label class="control-label">スケジュールタスクのアクション</label>
            <div>
                <select name="tasks[action][]" class="form-control">
                    <option value="command">コマンド</option>
                    <option value="power">電源</option>
                </select>
            </div>
        </div>
        <div class="form-group col-md-6">
            <label class="control-label">スケジュールタスクのペイロード</label>
            <div data-attribute="remove-task-element">
                <input type="text" name="tasks[payload][]" class="form-control">
                <div class="input-group-btn hidden">
                    <button type="button" class="btn btn-danger" data-action="remove-task"><i class="fa fa-close"></i></button>
                </div>
            </div>
        </div>
    </div>
</div>
@show
