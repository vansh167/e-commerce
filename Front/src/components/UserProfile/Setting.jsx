import React, { useEffect, useState, useRef } from "react";
import "./Settings.css";
import { useNavigate } from "react-router-dom";

/**
 * NOTE (important):
 * - This implementation stores the avatar (data URL) and a hashed password in localStorage.
 * - It's suitable for demo apps. For production, validate & store everything on the server and never store plaintext passwords.
 */

const PLACEHOLDER = "/assets/user.png";

const bufToHex = (buffer) =>
  Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

async function hashStringSHA256(str) {
  const enc = new TextEncoder();
  const data = enc.encode(str);
  const hash = await window.crypto.subtle.digest("SHA-256", data);
  return bufToHex(hash);
}

const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [profileMsg, setProfileMsg] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [addressInput, setAddressInput] = useState({ label: "", line: "" });
  const fileRef = useRef(null);

  useEffect(() => {
    const cu = localStorage.getItem("currentUser");
    if (!cu) {
      // not logged in
      return navigate("/login");
    }
    const parsed = JSON.parse(cu);
    // ensure addresses array exists
    if (!parsed.addresses) parsed.addresses = [];
    setUser(parsed);
    setAvatarPreview(parsed.avatarData || parsed.avatarUrl || "");
  }, [navigate]);

  // ---------- Profile handlers ----------
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setUser((u) => ({ ...u, [name]: value }));
  };

  const handleSaveProfile = () => {
    if (!user) return;
    user.updatedAt = new Date().toISOString();
    localStorage.setItem("currentUser", JSON.stringify(user));
    window.dispatchEvent(new Event("usersUpdated"));
    setProfileMsg("Profile saved.");
    setTimeout(() => setProfileMsg(""), 2500);
  };

  // ---------- Avatar handlers ----------
  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setAvatarPreview(dataUrl);
      // save immediately into local user object & localStorage
      setUser((u) => {
        const updated = { ...u, avatarData: dataUrl };
        localStorage.setItem("currentUser", JSON.stringify(updated));
        window.dispatchEvent(new Event("usersUpdated"));
        return updated;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview("");
    setUser((u) => {
      const updated = { ...u };
      delete updated.avatarData;
      localStorage.setItem("currentUser", JSON.stringify(updated));
      window.dispatchEvent(new Event("usersUpdated"));
      return updated;
    });
    // clear file input
    if (fileRef.current) fileRef.current.value = "";
  };

  // ---------- Password handlers ----------
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwMsg("");
    const current = e.target.currentPassword.value.trim();
    const nxt = e.target.newPassword.value.trim();
    const confirm = e.target.confirmNewPassword.value.trim();

    if (!nxt || nxt.length < 6) {
      setPwMsg("New password must be at least 6 characters.");
      return;
    }
    if (nxt !== confirm) {
      setPwMsg("New passwords do not match.");
      return;
    }

    // if user has stored hashed password, verify current
    const storedHash = user?.hashedPassword || null;
    if (storedHash) {
      const currentHash = await hashStringSHA256(current);
      if (currentHash !== storedHash) {
        setPwMsg("Current password is incorrect.");
        return;
      }
    }
    // set new hashed password
    const newHash = await hashStringSHA256(nxt);
    setUser((u) => {
      const updated = { ...u, hashedPassword: newHash };
      localStorage.setItem("currentUser", JSON.stringify(updated));
      window.dispatchEvent(new Event("usersUpdated"));
      return updated;
    });
    setPwMsg("Password updated.");
    e.target.reset();
    setTimeout(() => setPwMsg(""), 3000);
  };

  // ---------- Address handlers ----------
  const handleAddAddress = () => {
    if (!addressInput.line.trim()) return;
    setUser((u) => {
      const updated = { ...u, addresses: [...(u.addresses || []), { ...addressInput, id: Date.now() }] };
      localStorage.setItem("currentUser", JSON.stringify(updated));
      window.dispatchEvent(new Event("usersUpdated"));
      return updated;
    });
    setAddressInput({ label: "", line: "" });
  };

  const handleRemoveAddress = (id) => {
    setUser((u) => {
      const updated = { ...u, addresses: (u.addresses || []).filter((a) => a.id !== id) };
      localStorage.setItem("currentUser", JSON.stringify(updated));
      window.dispatchEvent(new Event("usersUpdated"));
      return updated;
    });
  };

  // ---------- Orders (demo from localStorage) ----------
  const orders = (() => {
    try {
      return JSON.parse(localStorage.getItem("orders") || "[]");
    } catch {
      return [];
    }
  })();

  // ---------- Export profile ----------
  const handleExport = () => {
    if (!user) return;
    const blob = new Blob([JSON.stringify(user, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `profile_${user.email || "user"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---------- Delete account ----------
  const handleDeleteAccount = () => {
    if (!window.confirm("Delete your account and all local data? This cannot be undone (demo only).")) return;
    // remove user-specific keys in localStorage (demo)
    localStorage.removeItem("currentUser");
    localStorage.removeItem("auth-token");
    localStorage.removeItem("isAdmin");
    // optionally remove orders belonging to this user (demo behavior)
    // You might want to filter orders instead of removing all in a real app.
    // localStorage.removeItem("orders");
    window.dispatchEvent(new Event("usersUpdated"));
    navigate("/", { replace: true });
  };

  if (!user) return null;

  return (
    <div className="settings-container">
      <div className="settings-card">
        <h2>Account Settings</h2>

        <div className="settings-row">
          <div className="avatar-column">
            <img className="settings-avatar" src={avatarPreview || PLACEHOLDER} alt="avatar" />
            <input ref={fileRef} id="avatarFile" type="file" accept="image/*" onChange={handleAvatarSelect} style={{ display: "none" }} />
            <div className="avatar-actions">
              <label htmlFor="avatarFile" className="btn btn-primary small">Upload</label>
              <button className="btn btn-secondary small" onClick={handleRemoveAvatar}>Remove</button>
            </div>
            <small className="muted">Avatar stored locally (demo)</small>
          </div>

          <div className="profile-column">
            <label>Full name</label>
            <input name="name" value={user.name || ""} onChange={handleFieldChange} />

            <label>Email address</label>
            <input name="email" value={user.email || ""} onChange={handleFieldChange} />

            <label>Phone</label>
            <input name="phone" value={user.phone || ""} onChange={handleFieldChange} />

            <div className="profile-actions">
              <button className="btn btn-success" onClick={handleSaveProfile}>Save changes</button>
              <button className="btn btn-outline-secondary" onClick={handleExport}>Export profile</button>
              <div className="profile-msg">{profileMsg}</div>
            </div>

            <div className="meta-row">
              <small>Member since: {user.createdAt ? new Date(user.createdAt).toLocaleString() : "—"}</small>
              <small>Last updated: {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "—"}</small>
            </div>
          </div>
        </div>

        <hr />

        <div className="password-section">
          <h3>Change password</h3>
          <form onSubmit={handleChangePassword} className="pw-form">
            <input name="currentPassword" type="password" placeholder="Current password (if set)" />
            <input name="newPassword" type="password" placeholder="New password" />
            <input name="confirmNewPassword" type="password" placeholder="Confirm new password" />
            <div className="pw-actions">
              <button className="btn btn-warning" type="submit">Update password</button>
              <div className="pw-msg">{pwMsg}</div>
            </div>
          </form>
        </div>

        <hr />

        <div className="addresses-section">
          <h3>Addresses</h3>

          <div className="addresses-list">
            {(user.addresses || []).map((a) => (
              <div key={a.id} className="address-row">
                <div>
                  <strong>{a.label}</strong>
                  <div className="address-line">{a.line}</div>
                </div>
                <button className="btn btn-link text-danger" onClick={() => handleRemoveAddress(a.id)}>Remove</button>
              </div>
            ))}
          </div>

          <div className="address-add">
            <input placeholder="Label (Home, Work...)" value={addressInput.label} onChange={(e) => setAddressInput((s) => ({ ...s, label: e.target.value }))} />
            <input placeholder="Address line" value={addressInput.line} onChange={(e) => setAddressInput((s) => ({ ...s, line: e.target.value }))} />
            <button className="btn btn-primary" onClick={handleAddAddress}>Add address</button>
          </div>
        </div>

        <hr />

        <div className="orders-section">
          <h3>Recent orders</h3>
          {orders.length === 0 ? (
            <div className="muted">No recent orders found.</div>
          ) : (
            <div className="orders-list">
              {orders.slice().reverse().slice(0, 6).map((o) => (
                <div className="order-row" key={o.id || o.orderId}>
                  <div>
                    <strong>#{o.orderId || o.id}</strong>
                    <div className="muted">{o.date ? new Date(o.date).toLocaleString() : "—"}</div>
                  </div>
                  <div>₹{o.total}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <hr />

        <div className="danger-actions">
          <button className="btn btn-danger" onClick={handleDeleteAccount}>Delete account</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
