<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskList;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index($taskListId)
    {
        $taskList = TaskList::findOrFail($taskListId);
        return response()->json($taskList->tasks, 200);
    }

    public function store(Request $request, $taskListId)
    {
        $request->validate([
            'description' => 'required|string|max:255',
        ]);

        $taskList = TaskList::findOrFail($taskListId);

        $task = $taskList->tasks()->create([
            'description' => $request->description,
            'is_complete' => false,
        ]);

        return response()->json($task, 201);
    }

    public function show($taskListId, $taskId)
    {
        $taskList = TaskList::findOrFail($taskListId);
        $task = $taskList->tasks()->findOrFail($taskId);
        return response()->json($task, 200);
    }

    public function update(Request $request, $taskListId, $taskId)
    {
        $request->validate([
            'description' => 'required|string|max:255',
            'is_complete' => 'required|boolean',
        ]);

        $taskList = TaskList::findOrFail($taskListId);
        $task = $taskList->tasks()->findOrFail($taskId);

        $task->update($request->only(['description', 'is_complete']));

        return response()->json($task, 200);
    }

    public function destroy($taskListId, $taskId)
    {
        $taskList = TaskList::findOrFail($taskListId);
        $task = $taskList->tasks()->findOrFail($taskId);
        $task->delete();

        return response()->json(null, 204);
    }
}