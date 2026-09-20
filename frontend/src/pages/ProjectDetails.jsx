import {useEffect, useMemo, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";

import {
  addProjectMember,
  getProjectById,
  getProjectMembers,
  removeProjectMember,
} from "../services/projectServices";

import {
  deleteTask,
  getProjectTasks,
  updateTaskStatus,
} from "../services/taskServices";

import CreateTaskModal from "../components/tasks/CreateTaskModal";
import EditTaskModal from "../components/tasks/EditTaskModal";
import TaskTable from "../components/tasks/TaskTable";

// --------------------------------------------------
// Project status styles
// --------------------------------------------------

const statusStyles = {
  planning: {
    label: "Planning",
    className: "border-zinc-700 bg-zinc-900 text-zinc-300",
    dot: "bg-zinc-500",
  },

  active: {
    label: "Active",
    className: "border-blue-500/20 bg-blue-500/10 text-blue-400",
    dot: "bg-blue-400",
  },

  "on hold": {
    label: "On Hold",
    className: "border-amber-500/20 bg-amber-500/10 text-amber-400",
    dot: "bg-amber-400",
  },

  completed: {
    label: "Completed",
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    dot: "bg-emerald-400",
  },

  archived: {
    label: "Archived",
    className: "border-zinc-700 bg-zinc-900 text-zinc-500",
    dot: "bg-zinc-600",
  },
};

// --------------------------------------------------
// Helpers
// --------------------------------------------------

const formatDate = date => {
  if (!date) {
    return "Not set";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not set";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getInitials = member => {
  const name = member?.name || member?.user?.name || member?.email || "Member";

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join("")
    .toUpperCase();
};

const getMemberName = member => {
  return (
    member?.name || member?.user?.name || member?.email || "Unknown member"
  );
};

const getMemberEmail = member => {
  return member?.email || member?.user?.email || "";
};

const getTaskStatus = task => {
  return (task?.status || "todo").toString().toLowerCase().replace(/_/g, " ");
};

const getProjectMembersFromResponse = data => {
  if (Array.isArray(data)) {
    return data;
  }

  return data?.members || [];
};

// --------------------------------------------------
// Component
// --------------------------------------------------

const ProjectDetails = () => {
  const {projectId} = useParams();
  const navigate = useNavigate();

  // ------------------------------------------------
  // Project state
  // ------------------------------------------------

  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [error, setError] = useState("");

  // ------------------------------------------------
  // Member state
  // ------------------------------------------------

  const [memberEmail, setMemberEmail] = useState("");
  const [memberLoading, setMemberLoading] = useState(false);
  const [memberError, setMemberError] = useState("");
  const [removingMemberId, setRemovingMemberId] = useState(null);

  // ------------------------------------------------
  // Task state
  // ------------------------------------------------

  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);

  const [editingTask, setEditingTask] = useState(null);

  const [taskSearch, setTaskSearch] = useState("");

  const [taskStatus, setTaskStatus] = useState("");

  const [taskPriority, setTaskPriority] = useState("");

  const [taskPage, setTaskPage] = useState(1);

  const [taskMeta, setTaskMeta] = useState({
    totalTasks: 0,
    totalPages: 1,
    currentPage: 1,
  });

  // ------------------------------------------------
  // Load project + members
  // ------------------------------------------------

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        setError("");

        const [projectData, membersData] = await Promise.all([
          getProjectById(projectId),
          getProjectMembers(projectId),
        ]);

        setProject(projectData?.project || projectData?.data || projectData);

        setMembers(getProjectMembersFromResponse(membersData));
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load this project.");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  // ------------------------------------------------
  // Load tasks
  // ------------------------------------------------

  useEffect(() => {
    const loadTasks = async () => {
      if (!projectId) {
        return;
      }

      try {
        setTasksLoading(true);

        const data = await getProjectTasks(projectId, {
          page: taskPage,
          limit: 10,
          search: taskSearch.trim() || undefined,
          status: taskStatus || undefined,
          priority: taskPriority || undefined,
        });

        setTasks(data?.tasks || []);

        setTaskMeta({
          totalTasks: data?.totalTasks ?? data?.count ?? 0,

          totalPages: data?.totalPages ?? 1,

          currentPage: data?.currentPage ?? taskPage,
        });
      } catch {
        setTasks([]);
        setTaskMeta({
          totalTasks: 0,
          totalPages: 1,
          currentPage: 1,
        });
      } finally {
        setTasksLoading(false);
      }
    };

    loadTasks();
  }, [projectId, taskPage, taskSearch, taskStatus, taskPriority]);

  // ------------------------------------------------
  // Task statistics
  // ------------------------------------------------

  const taskStats = useMemo(() => {
    const total = taskMeta.totalTasks;

    const completed = tasks.filter(
      task => getTaskStatus(task) === "completed",
    ).length;

    const inProgress = tasks.filter(
      task => getTaskStatus(task) === "in progress",
    ).length;

    const todo = Math.max(0, tasks.length - completed - inProgress);

    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      todo,
      progress,
    };
  }, [tasks, taskMeta.totalTasks]);

  // ------------------------------------------------
  // Project information
  // ------------------------------------------------

  const projectStatus = project?.status?.toString().toLowerCase() || "planning";

  const status = statusStyles[projectStatus] || statusStyles.planning;

  const projectCreatedAt = project?.createdAt || project?.created_at;

  const projectDueDate = project?.dueDate || project?.due_date;

  // ------------------------------------------------
  // Task handlers
  // ------------------------------------------------

  const handleTaskCreated = task => {
    if (!task) {
      return;
    }

    setTasks(prev => [task, ...prev]);

    setTaskMeta(prev => ({
      ...prev,
      totalTasks: prev.totalTasks + 1,
    }));
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);

      setTasks(prev =>
        prev.map(task =>
          task._id === taskId
            ? {
                ...task,
                status: newStatus,
              }
            : task,
        ),
      );
    } catch (err) {
      console.error("Failed to update task status:", err);
    }
  };

  const handleDeleteTask = async task => {
    const confirmed = window.confirm(
      `Delete "${task.title}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteTask(task._id);

      setTasks(prev => prev.filter(item => item._id !== task._id));

      setTaskMeta(prev => ({
        ...prev,
        totalTasks: Math.max(0, prev.totalTasks - 1),
      }));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const handleTaskUpdated = updatedTask => {
    if (!updatedTask) {
      return;
    }

    setTasks(prev =>
      prev.map(task => (task._id === updatedTask._id ? updatedTask : task)),
    );

    setEditingTask(null);
  };

  // ------------------------------------------------
  // Member handlers
  // ------------------------------------------------

  const handleAddMember = async event => {
    event.preventDefault();

    if (!memberEmail.trim()) {
      setMemberError("Enter a member email.");
      return;
    }

    try {
      setMemberLoading(true);
      setMemberError("");

      const data = await addProjectMember(projectId, memberEmail.trim());

      const newMember = data?.member || data?.user || data;

      if (newMember) {
        setMembers(prev => {
          const newMemberId = newMember?._id || newMember?.id;

          const exists = prev.some(
            member => (member?._id || member?.id) === newMemberId,
          );

          return exists ? prev : [...prev, newMember];
        });
      }

      setMemberEmail("");
    } catch (err) {
      setMemberError(
        err.response?.data?.message || "Unable to add this member.",
      );
    } finally {
      setMemberLoading(false);
    }
  };

  const handleRemoveMember = async member => {
    const userId =
      member?._id || member?.id || member?.user?._id || member?.user?.id;

    if (!userId) {
      return;
    }

    try {
      setRemovingMemberId(userId);
      setMemberError("");

      await removeProjectMember(projectId, userId);

      setMembers(prev =>
        prev.filter(currentMember => {
          const currentId =
            currentMember?._id ||
            currentMember?.id ||
            currentMember?.user?._id ||
            currentMember?.user?.id;

          return currentId !== userId;
        }),
      );
    } catch (err) {
      setMemberError(
        err.response?.data?.message || "Unable to remove this member.",
      );
    } finally {
      setRemovingMemberId(null);
    }
  };

  // ------------------------------------------------
  // Loading state
  // ------------------------------------------------

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="h-4 w-24 animate-pulse rounded bg-zinc-900" />

          <div className="mt-8 h-10 w-2/3 animate-pulse rounded-lg bg-zinc-900" />

          <div className="mt-3 h-5 w-1/2 animate-pulse rounded bg-zinc-900" />

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map(item => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-xl border border-zinc-900 bg-zinc-950"
              />
            ))}
          </div>

          <div className="mt-8 h-96 animate-pulse rounded-xl border border-zinc-900 bg-zinc-950" />
        </div>
      </main>
    );
  }

  // ------------------------------------------------
  // Error state
  // ------------------------------------------------

  if (error && !project) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-8 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-400">
            !
          </div>

          <h1 className="mt-5 text-lg font-semibold">Project unavailable</h1>

          <p className="mt-2 text-sm leading-6 text-zinc-500">{error}</p>

          <button
            type="button"
            onClick={() => navigate("/projects")}
            className="mt-6 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-400"
          >
            Back to projects
          </button>
        </div>
      </main>
    );
  }

  // ------------------------------------------------
  // Main UI
  // ------------------------------------------------

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* ---------------------------------------- */}
        {/* Breadcrumb */}
        {/* ---------------------------------------- */}

        <div className="flex items-center gap-2 text-sm">
          <Link
            to="/projects"
            className="text-zinc-500 transition hover:text-zinc-300"
          >
            Projects
          </Link>

          <span className="text-zinc-700">/</span>

          <span className="max-w-60 truncate text-zinc-300">
            {project?.name || "Project"}
          </span>
        </div>

        {/* ---------------------------------------- */}
        {/* Project Header */}
        {/* ---------------------------------------- */}

        <section className="relative mt-8 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />

          <div className="relative p-6 lg:p-8">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium ${status.className}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                    />

                    {status.label}
                  </span>

                  <span className="text-xs text-zinc-600">
                    {taskStats.total} {taskStats.total === 1 ? "task" : "tasks"}
                  </span>
                </div>

                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  {project?.name || "Untitled project"}
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500">
                  {project?.description ||
                    "No project description has been added yet."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/projects")}
                className="shrink-0 self-start rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900 hover:text-white"
              >
                Back to projects
              </button>
            </div>

            {/* Metadata */}

            <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-zinc-800 bg-zinc-800 sm:grid-cols-3">
              <div className="bg-zinc-950 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-600">
                  Created
                </p>

                <p className="mt-2 text-sm font-medium text-zinc-200">
                  {formatDate(projectCreatedAt)}
                </p>
              </div>

              <div className="bg-zinc-950 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-600">
                  Due date
                </p>

                <p className="mt-2 text-sm font-medium text-zinc-200">
                  {formatDate(projectDueDate)}
                </p>
              </div>

              <div className="bg-zinc-950 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-600">
                  Completion
                </p>

                <p className="mt-2 text-sm font-medium text-zinc-200">
                  {taskStats.progress}%
                </p>
              </div>
            </div>

            {/* Progress */}

            <div className="mt-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-300">
                    Project progress
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    {taskStats.completed} of {taskStats.total} tasks completed
                  </p>
                </div>

                <span className="text-sm font-medium text-zinc-300">
                  {taskStats.progress}%
                </span>
              </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-900">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-500"
                  style={{
                    width: `${taskStats.progress}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------- */}
        {/* Main Content */}
        {/* ---------------------------------------- */}

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* ====================================== */}
          {/* TASKS */}
          {/* ====================================== */}

          <section className="min-w-0">
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-blue-400">
                  Task management
                </p>

                <h2 className="mt-1 text-xl font-semibold text-white">
                  Project tasks
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Manage assignments, priorities, deadlines, and progress.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCreateTaskModal(true)}
                className="rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-400"
              >
                Create task
              </button>
            </div>

            {/* Filters */}

            <div className="mb-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
              <input
                type="search"
                value={taskSearch}
                onChange={event => {
                  setTaskSearch(event.target.value);

                  setTaskPage(1);
                }}
                placeholder="Search tasks..."
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-blue-500"
              />

              <select
                value={taskStatus}
                onChange={event => {
                  setTaskStatus(event.target.value);

                  setTaskPage(1);
                }}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-300 outline-none focus:border-blue-500"
              >
                <option value="">All statuses</option>

                <option value="todo">To Do</option>

                <option value="in progress">In Progress</option>

                <option value="completed">Completed</option>
              </select>

              <select
                value={taskPriority}
                onChange={event => {
                  setTaskPriority(event.target.value);

                  setTaskPage(1);
                }}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-300 outline-none focus:border-blue-500"
              >
                <option value="">All priorities</option>

                <option value="low">Low</option>

                <option value="medium">Medium</option>

                <option value="high">High</option>
              </select>
            </div>

            {/* Task table */}

            {tasksLoading ? (
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-8">
                <div className="space-y-4">
                  <div className="h-10 animate-pulse rounded-lg bg-zinc-900" />

                  <div className="h-16 animate-pulse rounded-lg bg-zinc-900" />

                  <div className="h-16 animate-pulse rounded-lg bg-zinc-900" />

                  <div className="h-16 animate-pulse rounded-lg bg-zinc-900" />
                </div>
              </div>
            ) : (
              <TaskTable
                tasks={tasks}
                onStatusChange={handleTaskStatusChange}
                onEdit={setEditingTask}
                onDelete={handleDeleteTask}
              />
            )}

            {/* Pagination */}

            {taskMeta.totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-zinc-600">
                  Page {taskMeta.currentPage} of {taskMeta.totalPages}
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={taskPage <= 1}
                    onClick={() => setTaskPage(prev => Math.max(1, prev - 1))}
                    className="rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    disabled={taskPage >= taskMeta.totalPages}
                    onClick={() =>
                      setTaskPage(prev =>
                        Math.min(taskMeta.totalPages, prev + 1),
                      )
                    }
                    className="rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* ====================================== */}
          {/* TEAM */}
          {/* ====================================== */}

          <aside className="h-fit rounded-2xl border border-zinc-800 bg-zinc-950">
            <div className="border-b border-zinc-800 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-blue-400">
                    People
                  </p>

                  <h2 className="mt-1 text-lg font-semibold tracking-tight">
                    Team members
                  </h2>
                </div>

                <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-500">
                  {members.length}
                </span>
              </div>
            </div>

            {/* Add member */}

            <form
              onSubmit={handleAddMember}
              className="border-b border-zinc-800 p-5"
            >
              <label
                htmlFor="member-email"
                className="mb-2 block text-xs font-medium text-zinc-500"
              >
                Add member
              </label>

              <div className="flex gap-2">
                <input
                  id="member-email"
                  type="email"
                  value={memberEmail}
                  onChange={event => setMemberEmail(event.target.value)}
                  placeholder="member@email.com"
                  disabled={memberLoading}
                  className="min-w-0 flex-1 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2.5 text-xs text-white outline-none transition placeholder:text-zinc-700 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 disabled:opacity-50"
                />

                <button
                  type="submit"
                  disabled={memberLoading}
                  className="rounded-lg bg-blue-500 px-3.5 py-2.5 text-xs font-medium text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {memberLoading ? "..." : "Add"}
                </button>
              </div>

              {memberError && (
                <p className="mt-2 text-xs text-red-400">{memberError}</p>
              )}
            </form>

            {/* Members */}

            <div className="divide-y divide-zinc-900">
              {members.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <p className="text-sm text-zinc-500">No team members yet.</p>

                  <p className="mt-1 text-xs text-zinc-700">
                    Add members using their email.
                  </p>
                </div>
              ) : (
                members.map(member => {
                  const memberId =
                    member?._id ||
                    member?.id ||
                    member?.user?._id ||
                    member?.user?.id;

                  return (
                    <div
                      key={memberId}
                      className="group flex items-center gap-3 px-5 py-4"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-xs font-semibold text-zinc-400">
                        {getInitials(member)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-zinc-300">
                          {getMemberName(member)}
                        </p>

                        <p className="truncate text-xs text-zinc-600">
                          {getMemberEmail(member)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member)}
                        disabled={removingMemberId === memberId}
                        className="rounded-md px-2 py-1 text-xs text-zinc-700 opacity-0 transition hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100 disabled:opacity-50"
                        title="Remove member"
                      >
                        {removingMemberId === memberId ? "..." : "Remove"}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* ========================================== */}
      {/* CREATE TASK MODAL */}
      {/* ========================================== */}

      {showCreateTaskModal && (
        <CreateTaskModal
          projectId={projectId}
          members={members}
          onClose={() => setShowCreateTaskModal(false)}
          onCreated={handleTaskCreated}
        />
      )}

      {/* ========================================== */}
      {/* EDIT TASK MODAL */}
      {/* ========================================== */}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          members={members}
          onClose={() => setEditingTask(null)}
          onUpdated={handleTaskUpdated}
        />
      )}
    </main>
  );
};

export default ProjectDetails;
