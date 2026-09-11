import React from 'react';
import {
  Sun,
  CalendarDays,
  Radio,
  AlertTriangle,
  Bookmark,
  Sparkles,
  Bot
} from 'lucide-react';

export const MobileBottomNav = ({
  activeTab = 'today',
  onTabChange,
  alertCount = 0,
  onOpenSavedModal,
  onOpenChatModal,
  isChatOpen
}) => {
  const navItems = [
    { id: 'today', label: 'Today', icon: Sun },
    { id: 'forecast', label: '14-Day', icon: CalendarDays },
    { id: 'radar', label: 'Radar', icon: Radio },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle, badge: alertCount > 0 ? alertCount : null },
    { id: 'saved', label: 'Saved', icon: Bookmark, action: onOpenSavedModal },
    { id: 'chat', label: 'AI Chat', icon: Sparkles, action: onOpenChatModal, highlight: true }
  ];

  const handleItemClick = (item) => {
    if (item.action) {
      item.action();
    } else if (onTabChange) {
      onTabChange(item.id);
    }
  };

  return (
    <nav className="mobile-bottom-nav glass-card" aria-label="Mobile Navigation">
      <div className="mobile-nav-inner">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = (activeTab === item.id && !item.action) || (item.id === 'chat' && isChatOpen);

          return (
            <button
              key={item.id}
              className={`mobile-nav-item ${isActive ? 'active' : ''} ${item.highlight ? 'ai-highlight' : ''}`}
              onClick={() => handleItemClick(item)}
              aria-label={item.label}
            >
              <div className="mobile-nav-icon-wrap">
                <Icon size={19} />
                {item.badge && (
                  <span className="mobile-nav-badge">{item.badge}</span>
                )}
              </div>
              <span className="mobile-nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
