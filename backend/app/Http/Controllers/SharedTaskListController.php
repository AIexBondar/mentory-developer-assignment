<?php

namespace App\Http\Controllers;

use App\Models\SharedTaskList;
use App\Models\TaskList;
use App\Models\User;
use Illuminate\Http\Request;

class SharedTaskListController extends Controller
{
    public function shareTaskList(Request $request)
    {
        $request->validate([
            'task_list_id' => 'required|exists:task_lists,id',
            'shared_with_user_id' => 'required|exists:users,id',
        ]);

        $sharedTaskList = SharedTaskList::create([
            'task_list_id' => $request->task_list_id,
            'shared_with_user_id' => $request->shared_with_user_id,
        ]);

        return response()->json([
            'message' => 'Task list shared successfully',
            'shared_task_list' => $sharedTaskList
        ]);
    }

    public function getSharedTaskLists($userId)
    {
        $sharedTaskLists = SharedTaskList::where('shared_with_user_id', $userId)->get();

        return response()->json([
            'shared_task_lists' => $sharedTaskLists
        ]);
    }

    public function revokeAccess(Request $request, $id)
    {
        $request->validate([
            'task_list_id' => 'required|exists:task_lists,id',
            'shared_with_user_id' => 'required|exists:users,id',
        ]);

        $sharedTaskList = SharedTaskList::where('task_list_id', $request->task_list_id)
            ->where('shared_with_user_id', $request->shared_with_user_id)
            ->first();

        if ($sharedTaskList) {
            $sharedTaskList->delete();

            return response()->json([
                'message' => 'Access to the task list revoked successfully'
            ]);
        }

        return response()->json([
            'message' => 'Shared task list not found'
        ], 404);
    }
}
