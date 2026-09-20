import {useState} from "react";
import {createTask} from "../../services/taskServices";

const CreateTaskModal = ({
  projectId,
  members = [],
  onClose,
  onCreated,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    assignedTo: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const assignedTo = formData.assignedTo || members[0]?._id || "";

  const handleChange = event => {
    const {name, value} = event.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async event => {
    event.preventDefault();

    setError("");

    if (!formData.title.trim()) {
      setError("Task title is required.");
      return;
    }

    if (!formData.dueDate) {
      setError("Due date is required.");
      return;
    }

    if (!assignedTo) {
      setError("Please assign the task to a project member.");
      return;
    }

    try {
      setLoading(true);

      const data = await createTask({
        title: formData.title.trim(),
        description: formData.description.trim(),
        projectId,
        assignedTo,
        priority: formData.priority,
        dueDate: formData.dueDate,
      });

      onCreated(data.task || data);
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create the task. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
        <div className="border-b border-zinc-800 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Create task
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Add a task and assign it to a project member.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-xl text-zinc-500 transition hover:text-white"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Task title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Implement authentication flow"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe what needs to be completed..."
              className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Priority
              </label>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Due date
              </label>

              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Assign to
            </label>

            <select
              name="assignedTo"
              value={assignedTo}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
            >
              <option value="">Select member</option>

              {members.map(member => (
                <option key={member._id} value={member._id}>
                  {member.name} — {member.email}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 border-t border-zinc-800 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-zinc-700 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;