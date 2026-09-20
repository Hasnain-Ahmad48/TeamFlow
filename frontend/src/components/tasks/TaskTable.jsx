const TaskTable = ({
  tasks = [],
  onStatusChange,
  onEdit,
  onDelete,
}) => {
//   const getStatusLabel = status => {
//     const normalized = String(status || "").toLowerCase();

//     if (
//       normalized === "in progress" ||
//       normalized === "in_progress"
//     ) {
//       return "In Progress";
//     }

//     if (
//       normalized === "completed" ||
//       normalized === "complete"
//     ) {
//       return "Completed";
//     }

//     return "To Do";
//   };

  const getStatusClasses = status => {
    const normalized = String(status || "").toLowerCase();

    if (normalized.includes("complete")) {
      return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
    }

    if (normalized.includes("progress")) {
      return "bg-blue-500/10 text-blue-300 border-blue-500/20";
    }

    return "bg-zinc-800 text-zinc-300 border-zinc-700";
  };

  const getPriorityClasses = priority => {
    switch (String(priority || "").toLowerCase()) {
      case "high":
        return "text-red-300";

      case "medium":
        return "text-amber-300";

      default:
        return "text-zinc-400";
    }
  };

  const formatDate = value => {
    if (!value) return "—";

    return new Date(value).toLocaleDateString(
      undefined,
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      },
    );
  };

  if (!tasks.length) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-6 py-16 text-center">
        <p className="text-sm font-medium text-zinc-300">
          No tasks found
        </p>

        <p className="mt-1 text-sm text-zinc-600">
          Create a task to start managing project work.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b border-zinc-800 bg-zinc-900/50">
            <tr className="text-left text-xs uppercase tracking-wide text-zinc-500">
              <th className="px-5 py-4 font-medium">
                Task
              </th>

              <th className="px-5 py-4 font-medium">
                Assigned to
              </th>

              <th className="px-5 py-4 font-medium">
                Priority
              </th>

              <th className="px-5 py-4 font-medium">
                Due date
              </th>

              <th className="px-5 py-4 font-medium">
                Status
              </th>

              <th className="px-5 py-4 text-right font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800">
            {tasks.map(task => (
              <tr
                key={task._id}
                className="transition hover:bg-zinc-900/40"
              >
                <td className="px-5 py-4">
                  <div>
                    <p className="max-w-xs truncate text-sm font-medium text-white">
                      {task.title}
                    </p>

                    {task.description && (
                      <p className="mt-1 max-w-xs truncate text-xs text-zinc-600">
                        {task.description}
                      </p>
                    )}
                  </div>
                </td>

                <td className="px-5 py-4">
                  <div>
                    <p className="text-sm text-zinc-300">
                      {task.assignedTo?.name || "Unassigned"}
                    </p>

                    {task.assignedTo?.email && (
                      <p className="mt-0.5 text-xs text-zinc-600">
                        {task.assignedTo.email}
                      </p>
                    )}
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`text-sm font-medium ${getPriorityClasses(
                      task.priority,
                    )}`}
                  >
                    {task.priority || "Medium"}
                  </span>
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-400">
                  {formatDate(task.dueDate)}
                </td>

                <td className="px-5 py-4">
                  <select
                    value={
                      task.status === "in_progress"
                        ? "in progress"
                        : task.status || "todo"
                    }
                    onChange={event =>
                      onStatusChange(
                        task._id,
                        event.target.value,
                      )
                    }
                    className={`rounded-md border px-2.5 py-1.5 text-xs font-medium outline-none ${getStatusClasses(
                      task.status,
                    )}`}
                  >
                    <option value="todo">To Do</option>
                    <option value="in progress">
                      In Progress
                    </option>
                    <option value="completed">
                      Completed
                    </option>
                  </select>
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(task)}
                      className="rounded-md border border-zinc-800 px-3 py-1.5 text-xs text-zinc-400 transition hover:border-zinc-700 hover:text-white"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(task)}
                      className="rounded-md border border-red-500/10 px-3 py-1.5 text-xs text-red-400 transition hover:border-red-500/30 hover:bg-red-500/5"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;