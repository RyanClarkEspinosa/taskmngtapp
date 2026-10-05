<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\TaskController;

Route::get('/', function () {
    return Inertia::render('DashboardPage');
});
Route::post('/save-task', [TaskController::class, 'saveTask']);
Route::put('/edit-task', [TaskController::class, 'saveTask']);
Route::put('/edit-task-status', [TaskController::class, 'updateTaskStatus']);
Route::delete('/delete-task', [TaskController::class, 'deleteTask']);
Route::get('/view-task', [TaskController::class, 'viewTask']);
