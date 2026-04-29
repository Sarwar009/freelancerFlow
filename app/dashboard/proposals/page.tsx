"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, FileText, DollarSign } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

interface Proposal {
  _id: string;
  jobTitle: string;
  budget: number | string;
  companyName: string;
  status: string;
  deadline: string; // ISO date string
}

const MySwal = withReactContent(Swal);

export default function Proposals() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/proposals");
    const data = await res.json();
    setProposals(data);
  }

  async function addProposal() {
    if (!title.trim() || !budget.trim() || !companyName.trim() || !deadline) {
      MySwal.fire({
        icon: "error",
        title: "Required Fields Missing",
        text: "Please enter Job Title, Budget, Company Name, and Deadline",
      });
      return;
    }

    setLoading(true);
    await fetch("/api/proposals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobTitle: title,
        budget: Number(budget),
        companyName,
        deadline,
        status: "sent",
      }),
    });
    setTitle("");
    setBudget("");
    setCompanyName("");
    setDeadline("");
    await load();
    setLoading(false);
    MySwal.fire({
      icon: "success",
      title: "Proposal Created!",
      timer: 1200,
      showConfirmButton: false,
    });
  }

  async function deleteProposal(id: string) {
    const result = await MySwal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "This proposal will be deleted permanently!",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
    });

    if (result.isConfirmed) {
      await fetch(`/api/proposals/${id}`, { method: "DELETE" });
      await load();
      MySwal.fire({
        icon: "success",
        title: "Deleted!",
        timer: 1000,
        showConfirmButton: false,
      });
    }
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/proposals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  useEffect(() => {
    load();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-gray-100 text-gray-800";
      case "viewed":
        return "bg-blue-100 text-blue-800";
      case "replied":
        return "bg-yellow-100 text-yellow-800";
      case "closed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Calculate days left
  const daysLeft = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = Math.ceil(
      (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diff >= 0 ? diff : 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Proposals</h1>
        <span className="text-sm text-gray-500">
          {proposals.length} proposals
        </span>
      </div>

      {/* Add Proposal Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Plus size={20} />
          Create New Proposal
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Job Title"
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
          <input
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Budget ($)"
            type="number"
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
          <input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Company Name"
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
          <input
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            placeholder="Deadline"
            type="date"
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
        <button
          onClick={addProposal}
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition transform hover:scale-105"
        >
          {loading ? "Creating..." : "Create Proposal"}
        </button>
      </motion.div>

      {/* Proposals List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {proposals.map((p, i) => (
          <motion.div
            key={p._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition group flex flex-col justify-between h-48"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                  <FileText className="text-indigo-600" size={24} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                    {p.jobTitle}
                  </h3>
                  <p className="text-sm font-medium text-gray-500 line-clamp-1">
                    {p.companyName}
                  </p>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <DollarSign size={16} />
                    <span className="font-medium">${p.budget}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Time Left:{" "}
                    <span className="font-medium">
                      {daysLeft(p.deadline)} days
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={p.status}
                  onChange={(e) => updateStatus(p._id, e.target.value)}
                  className={`px-3 py-1 rounded-full text-sm font-medium border-0 ${getStatusColor(p.status)}`}
                >
                  <option value="sent">Sent</option>
                  <option value="viewed">Viewed</option>
                  <option value="replied">Replied</option>
                  <option value="closed">Closed</option>
                </select>
                <button
                  onClick={() => deleteProposal(p._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Proposals */}
      {proposals.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">
            No proposals yet. Create your first proposal above!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
