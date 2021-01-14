import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default (props: any) => {
  const {
    loading,
    showPrevLink,
    showNextLink,
    handlePrevClick,
    handleNextClick
  } = props;
  return (
    <div className="nav-link-container" style={css_navLinkContainer}>
      <a
        href="pagenavigation"
        className={`nav-link 
					${showPrevLink ? "show" : "hide"}
					${loading ? "greyed-out" : ""}`}
        onClick={handlePrevClick}
        style={showPrevLink ? css_navLinkShow : css_navLinkHide}
      >
        <FiChevronLeft />
      </a>
      <a
        href="pagenavigation"
        className={`nav-link 
					${showNextLink ? "show" : "hide"}
					${loading ? "greyed-out" : ""}
					`}
        onClick={handleNextClick}
        style={showNextLink ? css_navLinkShow : css_navLinkHide}
      >
        <FiChevronRight />
      </a>
    </div>
  );
};

const css_navLinkContainer: React.CSSProperties = {
  margin: '20px 0',
  display: 'flex',
  justifyContent: 'flex-end',
}

const css_navLinkShow: React.CSSProperties = {
  color: '#555',
	textDecoration: 'none',
	border: '1px solid #898989',
	padding: '10px 20px',
  marginRight: '10px',
}

const css_navLinkHide: React.CSSProperties = {
  color: '#555',
	textDecoration: 'none',
	border: '1px solid #898989',
	padding: '10px 20px',
  marginRight: '10px',
  pointerEvents: 'none',
  background: '#f1f1f1',
  opacity: 0.5,
  display: 'none'
}