import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {getDashboardStatistics} from "../services/dashboardService";
import {useAuth} from "../context/AuthContext";

const Dashboard = () => {
  const {user} = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getDashboardStatistics();

        setDashboard(data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load dashboard statistics.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const statistics = dashboard?.statistics || dashboard?.stats || {};

  const totalProjects =
    statistics.totalProjects ?? dashboard?.totalProjects ?? 0;

  const totalTasks = statistics.totalTasks ?? dashboard?.totalTasks ?? 0;

  const completedTasks =
    statistics.completedTasks ?? dashboard?.completedTasks ?? 0;

  const overdueTasks = statistics.overdueTasks ?? dashboard?.overdueTasks ?? 0;

  const inProgressTasks =
    statistics.inProgressTasks ?? dashboard?.inProgressTasks ?? 0;

  const todoTasks = statistics.todoTasks ?? dashboard?.todoTasks ?? 0;

  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div>
              <div className="h-4 w-24 rounded bg-zinc-800" />
              <div className="mt-3 h-9 w-64 rounded bg-zinc-800" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map(item => (
                <div
                  key={item}
                  className="h-32 rounded-xl border border-zinc-800 bg-zinc-900/50"
                />
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="h-72 rounded-xl border border-zinc-800 bg-zinc-900/50 lg:col-span-2" />
              <div className="h-72 rounded-xl border border-zinc-800 bg-zinc-900/50" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Header */}
        <header className="flex flex-col gap-6 border-b border-zinc-800 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
                Workspace overview
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Good to see you,{" "}
              <span className="text-zinc-400">
                {user?.name?.split(" ")[0] || "there"}
              </span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">
              Here's what's happening across your projects and tasks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/projects"
              className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900 hover:text-white"
            >
              View projects
            </Link>

            <Link
              to="/my-tasks"
              className="rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-400"
            >
              My tasks
            </Link>
          </div>
        </header>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Statistics */}
        <section className="mt-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Projects */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 transition hover:border-zinc-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">Projects</span>

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/10">
                  <span className="text-sm">P</span>
                </div>
              </div>

              <p className="mt-5 text-3xl font-semibold tracking-tight">
                {totalProjects}
              </p>

              <p className="mt-1 text-xs text-zinc-600">Total projects</p>
            </div>

            {/* Tasks */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 transition hover:border-zinc-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">Tasks</span>

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/10">
                  <span className="text-sm">T</span>
                </div>
              </div>

              <p className="mt-5 text-3xl font-semibold tracking-tight">
                {totalTasks}
              </p>

              <p className="mt-1 text-xs text-zinc-600">Across all projects</p>
            </div>

            {/* Completed */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 transition hover:border-zinc-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">Completed</span>

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/10">
                  <span className="text-sm">✓</span>
                </div>
              </div>

              <p className="mt-5 text-3xl font-semibold tracking-tight">
                {completedTasks}
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                {completionRate}% completion rate
              </p>
            </div>

            {/* Overdue */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 transition hover:border-zinc-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">Overdue</span>

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400 ring-1 ring-red-500/10">
                  <span className="text-sm">!</span>
                </div>
              </div>

              <p className="mt-5 text-3xl font-semibold tracking-tight">
                {overdueTasks}
              </p>

              <p className="mt-1 text-xs text-zinc-600">Need attention</p>
            </div>
          </div>
        </section>

        {/* Main Dashboard */}
        <section className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Task Progress */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 lg:col-span-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-300">
                  Task progress
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  Current workload across your workspace
                </p>
              </div>

              <span className="text-sm font-medium text-blue-400">
                {completionRate}%
              </span>
            </div>

            {/* Progress */}
            <div className="mt-8">
              <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-700"
                  style={{
                    width: `${Math.min(completionRate, 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Breakdown */}
            <div className="mt-8 grid grid-cols-3 divide-x divide-zinc-800">
              <div className="pr-4">
                <p className="text-2xl font-semibold">{todoTasks}</p>

                <p className="mt-1 text-xs text-zinc-600">To do</p>
              </div>

              <div className="px-4">
                <p className="text-2xl font-semibold">{inProgressTasks}</p>

                <p className="mt-1 text-xs text-zinc-600">In progress</p>
              </div>

              <div className="pl-4">
                <p className="text-2xl font-semibold">{completedTasks}</p>

                <p className="mt-1 text-xs text-zinc-600">Completed</p>
              </div>
            </div>
          </div>

          {/* Attention */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
            <div>
              <p className="text-sm font-medium text-zinc-300">
                Attention needed
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                Tasks that may need your focus
              </p>
            </div>

            <div className="mt-8">
              <div className="flex items-end justify-between">
                <span className="text-4xl font-semibold tracking-tight">
                  {overdueTasks}
                </span>

                <span className="mb-1 text-xs text-red-400">overdue</span>
              </div>

              <div className="mt-5 h-px bg-zinc-800" />

              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs text-zinc-600">
                  Total active tasks
                </span>

                <span className="text-sm font-medium text-zinc-300">
                  {Math.max(totalTasks - completedTasks, 0)}
                </span>
              </div>
            </div>

            <Link
              to="/my-tasks"
              className="mt-8 block rounded-lg border border-zinc-800 px-4 py-3 text-center text-sm font-medium text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900 hover:text-white"
            >
              Review my tasks
            </Link>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
            <div className="mb-5">
              <p className="text-sm font-medium text-zinc-300">Quick actions</p>

              <p className="mt-1 text-xs text-zinc-600">
                Jump directly into your workspace
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Link
                to="/projects"
                className="group rounded-lg border border-zinc-800 bg-zinc-950/50 p-4 transition hover:border-blue-500/30 hover:bg-zinc-900"
              >
                <p className="text-sm font-medium text-zinc-200 group-hover:text-white">
                  Projects
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  Manage your projects
                </p>
              </Link>

              <Link
                to="/my-tasks"
                className="group rounded-lg border border-zinc-800 bg-zinc-950/50 p-4 transition hover:border-blue-500/30 hover:bg-zinc-900"
              >
                <p className="text-sm font-medium text-zinc-200 group-hover:text-white">
                  My tasks
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  View assigned tasks
                </p>
              </Link>

              <Link
                to="/projects"
                className="group rounded-lg border border-zinc-800 bg-zinc-950/50 p-4 transition hover:border-blue-500/30 hover:bg-zinc-900"
              >
                <p className="text-sm font-medium text-zinc-200 group-hover:text-white">
                  Workspace
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  Explore your workspace
                </p>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
