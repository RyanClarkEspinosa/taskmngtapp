<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tasks;

class TaskController extends Controller
{
    public function saveTask(Request $request)
    {
        $validated = $request->validate([
            'task_id'         => 'nullable|integer',
            'client_name'     => 'required|string|max:255',
            'proj_name'       => 'required|string|max:255',
            'task_desc'       => 'required|string',
            'task_status'     => 'required|in:planning,in_progress,on_hold,completed',
            'task_priority'   => 'required|string',
            'task_start_date' => 'required|date',
            'task_due_date'   => 'required|date|after_or_equal:task_start_date',
        ]);

        $task = Tasks::updateOrCreate(
            ['task_id' => $validated['task_id'] ?? null],
            collect($validated)->except('task_id')->all()
        );

        return response()->json($task);
    }
    public function viewTask(Request $request)
    {
        $tasks = Tasks::get();
        return $tasks;
    }
    public function deleteTask(Request $request)
    {
        return Tasks::where('task_id', '=', $request->task_id)->delete();
    }
    public function updateTaskStatus(Request $request)
    {
        return Tasks::where('task_id', '=', $request->task_id)->update([
            'task_status' => $request->task_status
        ]);
    }
}
