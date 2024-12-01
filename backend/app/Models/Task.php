<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = ['description', 'is_complete', 'task_list_id'];

    public function taskList()
    {
        return $this->belongsTo(TaskList::class);
    }
}
