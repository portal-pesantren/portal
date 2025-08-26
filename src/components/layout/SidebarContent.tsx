interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
}

interface SidebarContentProps {
  sections: Section[];
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
}

export default function SidebarContent({ sections, activeSection, onSectionClick }: SidebarContentProps) {
  return (
    <div className="bg-transparent">
      <h3 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">Daftar Isi</h3>
      <nav className="space-y-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => {
              onSectionClick(section.id);
              const element = document.getElementById(`section-${section.id}`);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 group ${
              activeSection === section.id 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
            }`}
          >
            <span className={`transition-transform duration-200 ${
              activeSection === section.id ? 'scale-110' : 'group-hover:scale-105'
            }`}>{section.icon}</span>
            <span className="font-medium">{section.title}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}