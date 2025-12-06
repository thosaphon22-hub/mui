import React, { useState } from 'react';
import { MOCK_ADMINS } from '../constants';
import { AdminUser } from '../types';
import { UserPlus, Trash2, Shield, ShieldAlert } from 'lucide-react';

const AdminManager: React.FC = () => {
  const [admins, setAdmins] = useState<AdminUser[]>(MOCK_ADMINS);

  const toggleStatus = (id: string) => {
    setAdmins(admins.map(admin => 
      admin.id === id ? { ...admin, isActive: !admin.isActive } : admin
    ));
  };

  const deleteAdmin = (id: string) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบผู้ดูแลระบบนี้?')) {
      setAdmins(admins.filter(a => a.id !== id));
    }
  };

  const addAdmin = () => {
    const newId = `ADM00${admins.length + 1}`;
    const newAdmin: AdminUser = {
      id: newId,
      username: `new_staff_${admins.length + 1}`,
      role: 'ADMIN',
      isActive: true,
      lastLogin: '-'
    };
    setAdmins([...admins, newAdmin]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">จัดการผู้ดูแลระบบ</h2>
        <button 
          onClick={addAdmin}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          <UserPlus size={18} /> เพิ่มผู้ดูแล
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm font-semibold uppercase">
              <th className="p-4">Username</th>
              <th className="p-4">Role</th>
              <th className="p-4">สถานะ</th>
              <th className="p-4">เข้าใช้งานล่าสุด</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-900 flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${admin.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-600'}`}>
                    {admin.username.charAt(0).toUpperCase()}
                  </div>
                  {admin.username}
                </td>
                <td className="p-4">
                  {admin.role === 'SUPER_ADMIN' ? (
                    <span className="flex items-center gap-1 text-purple-600 text-xs font-bold bg-purple-50 px-2 py-1 rounded-full w-fit">
                      <Shield size={12} /> SUPER ADMIN
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-gray-600 text-xs font-medium bg-gray-100 px-2 py-1 rounded-full w-fit">
                      <ShieldAlert size={12} /> ADMIN
                    </span>
                  )}
                </td>
                <td className="p-4">
                   <button 
                    onClick={() => admin.role !== 'SUPER_ADMIN' && toggleStatus(admin.id)}
                    disabled={admin.role === 'SUPER_ADMIN'}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${admin.isActive ? 'bg-green-500' : 'bg-gray-300'} ${admin.role === 'SUPER_ADMIN' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${admin.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </td>
                <td className="p-4 text-sm text-gray-500">{admin.lastLogin}</td>
                <td className="p-4 text-right">
                  {admin.role !== 'SUPER_ADMIN' && (
                    <button 
                      onClick={() => deleteAdmin(admin.id)}
                      className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminManager;