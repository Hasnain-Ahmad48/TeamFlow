import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {getProjects} from "../services/projectServices";
import CreateProjectModal from "../components/projects/CreateProjectModal";

const statusStyles = {
  planning: {
    label: "Planning",
    dot: "bg-amber-400",
    text: "text-amber-400",
    background: "bg-amber-400/10",
  },
  active: {
    label: "Active",
    dot: "bg-emerald-400",
    text: "text-emerald-400",
    background: "bg-emerald-400/10",
  },
  completed: {
    label: "Completed",
    dot: "bg-blue-400",
    text: "text-blue-400",
    background: "bg-blue-400/10",
  },
  archived: {
    label: "Archived",
    dot: "bg-zinc-500",
    text: "text-zinc-400",
    background: "bg-zinc-500/10",
  },
};

const getStatusStyle = status => {
  const normalizedStatus = status?.toLowerCase();

  return (
    statusStyles[normalizedStatus] || {
      label: status || "Unknown",
      dot: "bg-zinc-500",
      text: "text-zinc-400",
      background: "bg-zinc-500/10",
    }
  );
};

const formatDate = date => {
  if (!date) return "No due date";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getInitials = name => {
  if (!name) return "?";

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join("")
    .toUpperCase();
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProjects();

        setProjects(Array.isArray(data) ? data : data.projects || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load your projects.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="animate-pulse">
            <div className="h-4 w-24 rounded bg-zinc-800" />
            <div className="mt-4 h-9 w-52 rounded bg-zinc-800" />
            <div className="mt-3 h-4 w-80 rounded bg-zinc-900" />

            <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map(item => (
                <div
                  key={item}
                  className="h-80 rounded-2xl border border-zinc-800 bg-zinc-900/40"
                />
              ))}
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
        <header className="flex flex-col gap-5 border-b border-zinc-800 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />

              <span className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
                Workspace
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Projects
            </h1>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Manage your projects, deadlines, and team progress.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-xs text-zinc-500">
              {projects.length} {projects.length === 1 ? "project" : "projects"}
            </span>

            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-400"
            >
              New project
            </button>
          </div>
        </header>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!error && projects.length === 0 && (
          <div className="mt-10 flex min-h-80 items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20 px-6">
            <div className="max-w-sm text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/10">
                <span className="text-lg">+</span>
              </div>

              <h2 className="mt-5 text-lg font-semibold">No projects yet</h2>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Create your first project to start organizing tasks and
                collaborating with your team.
              </p>

              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="mt-6 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-400"
              >
                Create your first project
              </button>
            </div>
          </div>
        )}

        {/* Project Grid */}
        {!error && projects.length > 0 && (
          <section className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map(project => {
              const status = getStatusStyle(project.status);

              const assignedBy =
                project.assignedBy || project.owner || project.createdBy;

              const assignedByName =
                typeof assignedBy === "string"
                  ? assignedBy
                  : assignedBy?.name || "Unknown";

              return (
                <Link
                  key={project._id || project.id}
                  to={`/projects/${project._id || project.id}`}
                  className="group relative block"
                >
                  {/* Subtle glow */}
                  <div className="absolute -inset-px rounded-2xl bg-linear-to-br from-blue-500/20 via-transparent to-emerald-500/10 opacity-0 blur-sm transition duration-500 group-hover:opacity-100" />

                  <article className="relative h-full overflow-hidden rounded-2xl border border-zinc-800 bg-slate-950 shadow-2xl transition-all duration-300 group-hover:-translate-y-1 group-hover:border-zinc-700">
                    {/* Decorative glow */}
                    <div className="absolute -left-16 -top-16 h-32 w-32 rounded-full bg-linear-to-br from-blue-500/10 to-transparent blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-80" />

                    <div className="absolute -bottom-16 -right-16 h-32 w-32 rounded-full bg-linear-to-br from-emerald-500/10 to-transparent blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-80" />

                    <div className="relative flex h-full flex-col p-6">
                      {/* Top */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="relative shrink-0">
                            <div className="absolute -inset-1 rounded-xl bg-linear-to-r from-blue-500 to-emerald-500 opacity-20 blur-sm transition-opacity duration-300 group-hover:opacity-35" />

                            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-sm font-semibold text-blue-400">
                              {(project.name || "P").charAt(0).toUpperCase()}
                            </div>
                          </div>

                          <div className="min-w-0">
                            <h2 className="truncate font-semibold text-white">
                              {project.name}
                            </h2>

                            <p className="mt-0.5 text-xs text-zinc-600">
                              Project
                            </p>
                          </div>
                        </div>

                        {/* Status */}
                        <span
                          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.background} ${status.text}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                          />

                          {status.label}
                        </span>
                      </div>

                      {/* Description */}
                      <div className="mt-7 min-h-16">
                        <p className="line-clamp-3 text-sm leading-6 text-zinc-400">
                          {project.description ||
                            "No description provided for this project."}
                        </p>
                      </div>

                      {/* Divider */}
                      <div className="my-6 h-px bg-zinc-800" />

                      {/* Details */}
                      <div className="space-y-4">
                        {/* Assigned By */}
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-xs text-zinc-600">
                            Assigned by
                          </span>

                          <div className="flex min-w-0 items-center gap-2">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-medium text-zinc-300">
                              {getInitials(assignedByName)}
                            </div>

                            <span className="truncate text-xs font-medium text-zinc-300">
                              {assignedByName}
                            </span>
                          </div>
                        </div>

                        {/* Due Date */}
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-xs text-zinc-600">
                            Due date
                          </span>

                          <span className="text-xs font-medium text-zinc-300">
                            {formatDate(project.dueDate)}
                          </span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-7 flex items-center justify-between">
                        <span className="text-xs text-zinc-600 transition-colors group-hover:text-zinc-500">
                          View project
                        </span>

                        <span className="text-sm text-zinc-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue-400">
                          →
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </section>
        )}
      </div>

{showCreateModal && (
  <CreateProjectModal
    onClose={() => setShowCreateModal(false)}
    onCreated={project => {
      setProjects(prev => [project, ...prev]);
    }}
  />
)}

    </main>
  );
};

export default Projects;
