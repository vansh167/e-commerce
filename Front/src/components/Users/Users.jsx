import React, { useEffect, useMemo, useState } from "react";
import {
  FaUserCircle,
  FaTrash,
  FaEdit,
  FaDownload,
  FaSync,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaSort,
} from "react-icons/fa";
import "./Users.css";

const PAGE_SIZE = 8;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState({ key: "createdAt", dir: "desc" });
  const [page, setPage] = useState(1);

  // modal state
  const [confirmModal, setConfirmModal] = useState({ open: false, userId: null });
  const [editModal, setEditModal] = useState({ open: false, user: null });

  useEffect(() => {
    loadUsers();
    const onUsersUpdated = () => loadUsers();
    window.addEventListener("usersUpdated", onUsersUpdated);
    return () => window.removeEventListener("usersUpdated", onUsersUpdated);
  }, []);

  const loadUsers = () => {
    try {
      const raw = localStorage.getItem("users");
      const parsed = raw ? JSON.parse(raw) : [];
      setUsers(Array.isArray(parsed) ? parsed : []);
    } catch (err) {
      console.error("Failed to parse users from localStorage", err);
      setUsers([]);
    }
  };

  // Filtering
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      if (!q) return true;
      return (
        (u.name || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q)
      );
    });
  }, [users, query]);

  // Sorting
  const sorted = useMemo(() => {
    const arr = [...filtered];
    const { key, dir } = sortBy;
    arr.sort((a, b) => {
      let va = a[key] ?? "";
      let vb = b[key] ?? "";

      if (key === "createdAt") {
        va = va ? new Date(va).getTime() : 0;
        vb = vb ? new Date(vb).getTime() : 0;
      } else {
        va = String(va).toLowerCase();
        vb = String(vb).toLowerCase();
      }

      if (va < vb) return dir === "asc" ? -1 : 1;
      if (va > vb) return dir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortBy]);

  // Pagination
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageData = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [pageCount, page]);

  // helpers
  const saveAndNotify = (nextUsers) => {
    setUsers(nextUsers);
    localStorage.setItem("users", JSON.stringify(nextUsers));
    window.dispatchEvent(new Event("usersUpdated"));
  };

  // Delete flow with modal
  const confirmDelete = (userId) => {
    setConfirmModal({ open: true, userId });
  };

  const doDelete = () => {
    const userId = confirmModal.userId;
    const next = users.filter((u) => u.id !== userId);
    saveAndNotify(next);
    setConfirmModal({ open: false, userId: null });
  };

  // Edit flow
  const openEdit = (user) => {
    setEditModal({ open: true, user: { ...user } });
  };

  const saveEdit = () => {
    const u = editModal.user;
    if (!u) return;
    const next = users.map((item) => (item.id === u.id ? u : item));
    saveAndNotify(next);
    setEditModal({ open: false, user: null });
  };

  const exportCSV = () => {
    const header = ["id", "name", "email", "createdAt"];
    const rows = users.map((u) =>
      [u.id ?? "", u.name ?? "", u.email ?? "", u.createdAt ?? ""].map((v) =>
        `"${String(v).replace(/"/g, '""')}"`
      ).join(",")
    );
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleSort = (key) => {
    setSortBy((s) => {
      if (s.key === key) return { key, dir: s.dir === "asc" ? "desc" : "asc" };
      return { key, dir: "asc" };
    });
  };

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h2>Users</h2>
          <p className="muted">All users who signed up in the application.</p>
        </div>

        <div className="actions">
          <div className="search">
            <FaSearch />
            <input
              placeholder="Search by name or email..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            />
          </div>

          <button className="btn" onClick={loadUsers} title="Refresh">
            <FaSync /> Refresh
          </button>

          <button className="btn primary" onClick={exportCSV} title="Export CSV">
            <FaDownload /> Export
          </button>
        </div>
      </div>

      <div className="users-body">
        {users.length === 0 ? (
          <div className="empty-state">
            <FaUserCircle size={72} />
            <h3>No users yet</h3>
            <p>When users sign up, they'll appear here.</p>
            <button className="btn" onClick={loadUsers}>Reload</button>
          </div>
        ) : (
          <>
            <div className="users-table-card">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th className="col-avatar">User</th>
                    <th onClick={() => toggleSort("name")} className="sortable">
                      Name <FaSort />
                    </th>
                    <th onClick={() => toggleSort("email")} className="sortable">
                      Email <FaSort />
                    </th>
                    <th onClick={() => toggleSort("createdAt")} className="sortable">
                      Signed Up <FaSort />
                    </th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pageData.map((user, idx) => (
                    <tr key={user.id ?? idx}>
                      <td>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                      <td className="col-avatar">
                        <div className="avatar">
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.name} />
                          ) : (
                            <div className="initials">
                              {(user.name || user.email || "U")
                                .split(" ")
                                .map((s) => s[0])
                                .slice(0, 2)
                                .join("")
                                .toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="user-meta">
                          <div className="user-name">{user.name ?? "-"}</div>
                          <div className="user-email muted">{user.email ?? "-"}</div>
                        </div>
                      </td>
                      <td>{user.name ?? "-"}</td>
                      <td>{user.email ?? "-"}</td>
                      <td className="muted">
                        {user.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}
                      </td>
                      <td>
                        <div className="row-actions">
                          <button className="icon-btn" title="Edit" onClick={() => openEdit(user)}>
                            <FaEdit />
                          </button>
                          <button className="icon-btn danger" title="Delete" onClick={() => confirmDelete(user.id)}>
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* pagination */}
              <div className="pagination">
                <div className="page-info">
                  Showing {(page - 1) * PAGE_SIZE + 1} - {Math.min(page * PAGE_SIZE, sorted.length)} of {sorted.length}
                </div>
                <div className="page-controls">
                  <button className="icon-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                    <FaChevronLeft />
                  </button>
                  <span className="page-number">{page} / {pageCount}</span>
                  <button className="icon-btn" onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page === pageCount}>
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Confirm Delete Modal */}
      {confirmModal.open && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Delete user?</h3>
            <p>Are you sure you want to permanently delete this user? This cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn" onClick={() => setConfirmModal({ open: false, userId: null })}>Cancel</button>
              <button className="btn danger" onClick={doDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal.open && editModal.user && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Edit user</h3>
            <div className="form-row">
              <label>Name</label>
              <input
                value={editModal.user.name ?? ""}
                onChange={(e) => setEditModal((m) => ({ ...m, user: { ...m.user, name: e.target.value } }))}
              />
            </div>
            <div className="form-row">
              <label>Email</label>
              <input
                value={editModal.user.email ?? ""}
                onChange={(e) => setEditModal((m) => ({ ...m, user: { ...m.user, email: e.target.value } }))}
              />
            </div>

            <div className="modal-actions">
              <button className="btn" onClick={() => setEditModal({ open: false, user: null })}>Cancel</button>
              <button
                className="btn primary"
                onClick={() => {
                  // basic validation
                  if (!editModal.user.email) {
                    alert("Email is required");
                    return;
                  }
                  saveEdit();
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
