import { getAdminUsers } from "@/lib/admin-data";
import { auth } from "@/lib/auth";
import AddUserForm from "@/components/admin/AddUserForm";
import RemoveUserButton from "@/components/admin/RemoveUserButton";
import { Shield, ShieldCheck, Mail } from "lucide-react";

export default async function AdminUsersPage() {
  const session = await auth();
  const users = await getAdminUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Users</h1>
        <p className="text-gray-600 mt-1">
          Manage who can access the admin dashboard
        </p>
      </div>

      {/* Add User Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Add Admin User
        </h2>
        <AddUserForm />
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Current Admins</h2>
          <p className="text-sm text-gray-500">
            {users.length} admin user{users.length !== 1 ? "s" : ""}
          </p>
        </div>
        {users.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No admin users configured. Add users above or set ADMIN_EMAILS
            environment variable.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {users.map((user) => (
              <div
                key={user.email}
                className="p-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-lg ${
                      user.role === "superadmin"
                        ? "bg-purple-100"
                        : "bg-indigo-100"
                    }`}
                  >
                    {user.role === "superadmin" ? (
                      <ShieldCheck className="w-5 h-5 text-purple-600" />
                    ) : (
                      <Shield className="w-5 h-5 text-indigo-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">
                        {user.name || user.email}
                      </p>
                      {user.role === "superadmin" && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                          Super Admin
                        </span>
                      )}
                      {user.email === session?.user?.email && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
                          You
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {user.email}
                    </p>
                    {user.addedAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        Added {new Date(user.addedAt).toLocaleDateString()}
                        {user.addedBy && ` by ${user.addedBy}`}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {user.email !== session?.user?.email && (
                    <RemoveUserButton email={user.email} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">
          How Admin Access Works
        </h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>
            - Users sign in with Google or GitHub using their email
          </li>
          <li>
            - Only emails listed here (or in ADMIN_EMAILS env var) can access
            the admin area
          </li>
          <li>
            - Super admins have elevated permissions for critical settings
          </li>
          <li>
            - You cannot remove yourself from the admin list
          </li>
        </ul>
      </div>
    </div>
  );
}
