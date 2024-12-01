<?php

namespace App\Http\Controllers;

use App\Models\TaskList;
use Illuminate\Http\Request;

class TaskListController extends Controller
{
    public function index()
    {
        return response()->json(TaskList::all(), 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $taskList = TaskList::create([
            'name' => $request->name,
            'user_id' => auth()->user()->id,
        ]);

        return response()->json($taskList, 201);
    }

    public function show($id)
    {
        $taskList = TaskList::findOrFail($id);
        return response()->json($taskList, 200);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $taskList = TaskList::findOrFail($id);
        $taskList->update($request->only(['name']));

        return response()->json($taskList, 200);
    }

    public function destroy($id)
    {
        $taskList = TaskList::findOrFail($id);
        $taskList->delete();

        return response()->json(null, 204);
    }
}

