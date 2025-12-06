import React, { useState } from 'react';
import { EMAIL_TEMPLATES } from '../constants';
import { EmailTemplate } from '../types';
import { Send, Eye, Wand2, RefreshCw } from 'lucide-react';
import { generateEmailContent } from '../services/geminiService';

const EmailManager: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate>(EMAIL_TEMPLATES[0]);
  const [customSubject, setCustomSubject] = useState(EMAIL_TEMPLATES[0].subject);
  const [customBody, setCustomBody] = useState(EMAIL_TEMPLATES[0].body);
  const [isSending, setIsSending] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTemplateChange = (templateId: string) => {
    const t = EMAIL_TEMPLATES.find(t => t.id === templateId);
    if (t) {
      setSelectedTemplate(t);
      setCustomSubject(t.subject);
      setCustomBody(t.body);
    }
  };

  const handleAiGenerate = async () => {
    setIsGenerating(true);
    const content = await generateEmailContent(
      selectedTemplate.title, 
      '{name}', 
      'สุภาพ เป็นทางการ และให้กำลังใจ'
    );
    setCustomBody(content);
    setIsGenerating(false);
  };

  const handleSend = () => {
    setIsSending(true);
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      alert('ส่งอีเมลเรียบร้อยแล้ว (Simulation)');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">ระบบส่งอีเมลแจ้งผล</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Selector & Editor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">เลือกเทมเพลต</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={selectedTemplate.id}
                onChange={(e) => handleTemplateChange(e.target.value)}
              >
                {EMAIL_TEMPLATES.map(t => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">หัวข้ออีเมล (Subject)</label>
              <input 
                type="text" 
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">เนื้อหา (Body)</label>
                <button 
                  onClick={handleAiGenerate}
                  disabled={isGenerating}
                  className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50"
                >
                   {isGenerating ? <RefreshCw className="animate-spin" size={14} /> : <Wand2 size={14} />}
                   {isGenerating ? 'กำลังสร้าง...' : 'เขียนใหม่ด้วย AI'}
                </button>
              </div>
              <textarea 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-64 font-mono text-sm"
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                * ใช้ {`{name}`} แทนชื่อผู้สมัคร, {`{plan}`} แทนแผนการเรียน
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={handleSend}
                disabled={isSending}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-70"
              >
                {isSending ? 'กำลังส่ง...' : <><Send size={18} /> ส่งอีเมลแบบกลุ่ม</>}
              </button>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
            <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-4 pb-2 border-b">
              <Eye size={18} /> ตัวอย่างการแสดงผล
            </h3>
            
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500 block text-xs">ถึง:</span>
                <span className="font-medium">สมชาย ใจดี (somchai@example.com)</span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs">เรื่อง:</span>
                <span className="font-medium">{customSubject}</span>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-line">
                  {customBody.replace('{name}', 'สมชาย ใจดี').replace('{plan}', 'วิทย์-คณิต')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailManager;