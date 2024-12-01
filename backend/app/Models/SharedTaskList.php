<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SharedTaskList extends Model
{
    use HasFactory;

    protected $fillable = [
        'task_list_id', 
        'shared_with_user_id',
    ];

    public function taskList()
    {
        return $this->belongsTo(TaskList::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'shared_with_user_id');
    }
}
