<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tasks extends Model
{
    protected $primaryKey = 'task_id';
    protected $fillable = [
        'client_name',
        'proj_name',
        'task_desc',
        'task_status',
        'task_priority',
        'task_start_date',
        'task_due_date',
    ];
}
