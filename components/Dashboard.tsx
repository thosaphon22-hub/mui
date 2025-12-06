import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { StudentApplication, StudyPlan, ApplicationStatus, StudyLevel } from '../types';
import { Users, Clock, CheckCircle, XCircle } from 'lucide-react';

interface DashboardProps {
  applications: StudentApplication[];
}

const COLORS = ['#EC4899', '#8B5CF6', '#F59E0B', '#10B981'];

const Dashboard: React.FC<DashboardProps> = ({ applications }) => {
  const total = applications.length;
  const newApps = applications.filter(a => a.status === ApplicationStatus.NEW || a.status === ApplicationStatus.DOCS_OK).length;
  const approved = applications.filter(a => a.status === ApplicationStatus.APPROVED).length;
  const incomplete = applications.filter(a => a.status === ApplicationStatus.INCOMPLETE).length;

  const levelData = [
    { name: 'ม.1', value: applications.filter(a => a.level === StudyLevel.M1).length },
    { name: 'ม.4', value: applications.filter(a => a.level === StudyLevel.M4).length }
  ].filter(d => d.value > 0);

  const planDataM4 = Object.values(StudyPlan)
    .filter(p => [StudyPlan.SCI_MATH, StudyPlan.ENG_MATH, StudyPlan.ENG_LANG, StudyPlan.GEN_ART].includes(p as any))
    .map(plan => ({
      name: plan,
      value: applications.filter(a => a.studyPlan === plan).length
    })).filter(d => d.value > 0);

  const StatCard = ({ title, value, color, icon: Icon }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard สถิติการรับสมัคร</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="ใบสมัครทั้งหมด" value={total} color="bg-blue-500 shadow-blue-200" icon={Users} />
        <StatCard title="รอตรวจสอบ" value={newApps} color="bg-purple-500 shadow-purple-200" icon={Clock} />
        <StatCard title="ผ่านการคัดเลือก" value={approved} color="bg-green-500 shadow-green-200" icon={CheckCircle} />
        <StatCard title="เอกสารไม่ครบ" value={incomplete} color="bg-orange-500 shadow-orange-200" icon={XCircle} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">สัดส่วนระดับชั้น</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={levelData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {levelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#EC4899' : '#8B5CF6'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">แผนการเรียน ม.4 ยอดนิยม</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={planDataM4} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="name" type="category" width={100} style={{ fontSize: '12px', fontWeight: 500 }} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} />
                <Bar dataKey="value" fill="#F59E0B" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;