// src/pages/DashboardBuilder/components/widgets/ProfessionalKPIWidget.jsx
import React from "react";
import { PROFESSIONAL_WIDGET_CONFIGS } from "../../constants";
import { FaArrowDown, FaArrowUp, FaPercent, FaDollarSign, FaShoppingCart, FaUsers } from "react-icons/fa";

/**
 * Professional KPI Widget with exact design standards
 *
 * Features:
 * - White background, 32px border radius, 24px padding
 * - Icon with colored background
 * - Large value display with proper number formatting
 * - Growth percentage with up/down arrows and colors
 * - Figtree font family with specific weights and colors
 */

// Icon mapping for string-based icon names to React components
const iconMap = {
  FaDollarSign: FaDollarSign,
  FaShoppingCart: FaShoppingCart,
  FaUsers: FaUsers,
  // Add more icons as needed
};

// Helper function to render icon
const renderIcon = (icon) => {
  if (typeof icon === 'string' && iconMap[icon]) {
    const IconComponent = iconMap[icon];
    return <IconComponent />;
  }
  // If it's already a React component or emoji, render as is
  return icon;
};
const ProfessionalKPIWidget = ({ widget, isSelected, onClick }) => {
  const config = widget.config || {};

  // Use default config or merge with widget config
  const title = config.title || PROFESSIONAL_WIDGET_CONFIGS.KPI_CARD.title;
  const value = config.value || PROFESSIONAL_WIDGET_CONFIGS.KPI_CARD.value;
  const prefix = config.prefix || PROFESSIONAL_WIDGET_CONFIGS.KPI_CARD.prefix;
  const growth = config.growth || PROFESSIONAL_WIDGET_CONFIGS.KPI_CARD.growth;
  const growthDirection =
    config.growthDirection ||
    PROFESSIONAL_WIDGET_CONFIGS.KPI_CARD.growthDirection;
  const growthText =
    config.growthText || PROFESSIONAL_WIDGET_CONFIGS.KPI_CARD.growthText;
  const icon = config.icon || PROFESSIONAL_WIDGET_CONFIGS.KPI_CARD.icon;
  const iconBg = config.iconBg || PROFESSIONAL_WIDGET_CONFIGS.KPI_CARD.iconBg;
  const growthColor =
    config.growthColor || PROFESSIONAL_WIDGET_CONFIGS.KPI_CARD.growthColor;
  const growthTextColor =
    config.growthTextColor ||
    PROFESSIONAL_WIDGET_CONFIGS.KPI_CARD.growthTextColor;

  return (
    <div className="stat-card">
      <div className={`stat-icon ${title.toLowerCase().split(" ")[0]}`}>
        {renderIcon(icon)}
      </div>
      <div className="stat-content">
        <h3>{title}</h3>

        <div className="stat-change positive">
          <div className="stat-value">
            {prefix}
            {value?.toLocaleString()}
          </div>
          <div className="stat-change-info">
            {growthDirection === "up" ? <FaArrowUp /> : <FaArrowDown />} +{" "}
            {growth} <FaPercent />
            {/* <span>{changeText}</span> */}
            <p> {growthText}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalKPIWidget;
