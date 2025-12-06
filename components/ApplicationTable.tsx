import React, { useState, useEffect } from 'react';
import { StudentApplication, ApplicationStatus, StudyPlan, StudyLevel } from '../types';
import { Search, Download, CheckSquare, XSquare, Eye, FileText } from 'lucide-react';
import ApplicationDetailModal from './ApplicationDetailModal';

interface ApplicationTableProps {
  applications: StudentApplication[];
  onUpdateStatus: (ids: string[], status: ApplicationStatus) => void;
}

const ApplicationTable: React.FC<ApplicationTableProps> = ({ applications, onUpdateStatus }) => {
  const [filterText, setFilterText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filteredApps, setFilteredApps] = useState<StudentApplication[]>(applications);
  const [viewingApp, setViewingApp] = useState<StudentApplication | null>(null);

  useEffect(() => {
    let result = applications;
    
    if (filterText) {
      const lower = filterText.toLowerCase();
      result = result.filter(app => 
        app.thFirstName.includes(filterText) ||
        app.thLastName.includes(filterText) ||
        app.email.toLowerCase().includes(lower) ||
        app.id.toLowerCase().includes(lower)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(app => app.status === statusFilter);
    }

    if (levelFilter !== 'all') {
      result = result.filter(app => app.level === levelFilter);
    }

    setFilteredApps(result);
  }, [applications, filterText, statusFilter, levelFilter]);

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredApps.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredApps.map(a => a.id)));
    }
  };

  const toggleSelectOne = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleBulkStatusChange = (status: ApplicationStatus) => {
    if (selectedIds.size === 0) return;
    if (confirm(`ยืนยันการเปลี่ยนสถานะ ${selectedIds.size} รายการ เป็น "${status}"?`)) {
      onUpdateStatus(Array.from(selectedIds), status);
      setSelectedIds(new Set());
    }
  };

  const exportCSV = () => {
    const headers = ['ID,ชื่อ-นามสกุล,ระดับชั้น,แผนการเรียน,เบอร์โทร,สถานะ,วันที่สมัคร'];
    const rows = filteredApps.map(app => 
      `${app.id},"${app.prefix}${app.thFirstName} ${app.thLastName}",${app.level},${app.studyPlan},${app.phone},${app.status},${app.appliedDate}`
    );
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "student_applications.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    const styles = {
      [ApplicationStatus.APPROVED]: 'bg-green-100 text-green-800',
      [ApplicationStatus.REJECTED]: 'bg-red-100 text-red-800',
      [ApplicationStatus.DOCS_OK]: 'bg-blue-100 text-blue-800',
      [ApplicationStatus.INCOMPLETE]: 'bg-orange-100 text-orange-800',
      [ApplicationStatus.NEW]: 'bg-purple-100 text-purple-800',
      [ApplicationStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100'}`}>{status}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">จัดการใบสมัคร</h2>
        <button 
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm"
        >
          <Download size={18} /> ส่งออก CSV
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="ค้นหาชื่อ, ID..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
        <select 
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none bg-white"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">สถานะทั้งหมด</option>
          {Object.values(ApplicationStatus).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select 
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none bg-white"
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
        >
          <option value="all">ระดับชั้นทั้งหมด</option>
          {Object.values(StudyLevel).map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {selectedIds.size > 0 && (
        <div className="bg-blue-50 p-3 rounded-lg flex items-center justify-between border border-blue-100 animate-fade-in">
          <span className="text-blue-800 font-medium px-2">เลือก {selectedIds.size} รายการ</span>
          <div className="flex gap-2">
            <button 
              onClick={() => handleBulkStatusChange(ApplicationStatus.APPROVED)}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              <CheckSquare size={16} /> ผ่าน
            </button>
            <button 
              onClick={() => handleBulkStatusChange(ApplicationStatus.INCOMPLETE)}
              className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm"
            >
              <FileText size={16} /> เอกสารไม่ครบ
            </button>
             <button 
              onClick={() => handleBulkStatusChange(ApplicationStatus.REJECTED)}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              <XSquare size={16} /> ไม่ผ่าน
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm font-semibold uppercase">
                <th className="p-4 w-10">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-pink-600 focus:ring-pink-500 w-4 h-4"
                    checked={filteredApps.length > 0 && selectedIds.size === filteredApps.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="p-4">ID</th>
                <th className="p-4">ผู้สมัคร</th>
                <th className="p-4">ระดับชั้น</th>
                <th className="p-4">แผนการเรียน</th>
                <th className="p-4">วันที่สมัคร</th>
                <th className="p-4">สถานะ</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">ไม่พบข้อมูลใบสมัคร</td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors text-sm text-gray-700">
                    <td className="p-4">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-pink-600 focus:ring-pink-500 w-4 h-4"
                        checked={selectedIds.has(app.id)}
                        onChange={() => toggleSelectOne(app.id)}
                      />
                    </td>
                    <td className="p-4 font-mono text-gray-500 font-medium">{app.id}</td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{app.prefix}{app.thFirstName} {app.thLastName}</div>
                      <div className="text-xs text-gray-500">{app.email}</div>
                    </td>
                    <td className="p-4">{app.level}</td>
                    <td className="p-4">{app.studyPlan}</td>
                    <td className="p-4 text-gray-500">{new Date(app.appliedDate).toLocaleDateString('th-TH')}</td>
                    <td className="p-4">{getStatusBadge(app.status)}</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => setViewingApp(app)}
                        className="text-gray-400 hover:text-pink-600 p-2 rounded-full hover:bg-pink-50 transition"
                        title="ดูรายละเอียด"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewingApp && (
        <ApplicationDetailModal 
          application={viewingApp} 
          onClose={() => setViewingApp(null)}
          onUpdateStatus={(status) => {
            onUpdateStatus([viewingApp.id], status);
            setViewingApp(null);
          }}
        />
      )}
    </div>
  );
};

export default ApplicationTable;