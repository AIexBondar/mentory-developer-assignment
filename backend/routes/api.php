<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskListController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\SharedTaskListController;

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::apiResource('task-lists', TaskListController::class);
    Route::apiResource('task-lists.tasks', TaskController::class); // Вложенные маршруты для задач

    Route::post('/share-task-list', [SharedTaskListController::class, 'shareTaskList']);
    Route::get('/shared-task-lists/{userId}', [SharedTaskListController::class, 'getSharedTaskLists']);
    Route::delete('/revoke-access/{id}', [SharedTaskListController::class, 'revokeAccess']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
